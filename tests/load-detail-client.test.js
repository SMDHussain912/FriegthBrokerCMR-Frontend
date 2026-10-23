import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LoadDetailClient } from "@/components/load-detail-client";

// `next/link` is not exercised by this test beyond rendering an anchor.
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// The client component fetches the carrier list and the session from the BFF.
vi.mock("@/lib/data", () => ({
  getLoadEligibility: vi.fn(),
}));

const load = {
  _id: "load-1",
  loadNumber: "LD-2024-0001",
  status: "POSTED",
  shipperName: "Northwind Freight",
  commodity: "Paper rolls",
  declaredCargoValue: 42_500,
  equipmentType: "DRY_VAN",
  origin: { city: "Chicago", state: "IL", pickupDate: "2024-05-02T08:00:00.000Z" },
  destination: { city: "Columbus", state: "OH", deliveryDate: "2024-05-04T16:00:00.000Z" },
};

/**
 * Regression guard for the P0 crash on /dashboard/loads/[id].
 *
 * `components/load-detail-client.js` used `useEffect` without importing it.
 * Because the file is a client component, React threw before the screen could
 * paint, so the load detail route — the screen that leads to assigning a
 * carrier — was completely non-functional. The ESLint `no-undef` rule now
 * catches the same defect statically (see eslint.config.mjs), and this test
 * catches it at runtime.
 *
 * The test asserts the component actually mounts and renders its content. If
 * the `useEffect` import is removed again, React throws during render and
 * this test fails.
 */
describe("LoadDetailClient", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn(async (url) => {
      if (String(url).includes("/api/carriers")) {
        return { ok: true, json: async () => ({ carriers: [] }) };
      }
      if (String(url).includes("/api/auth/me")) {
        return { ok: true, json: async () => ({ user: { role: "broker" } }) };
      }
      return { ok: true, json: async () => ({}) };
    });
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * Renders the component and flushes the mount effects.
   *
   * `AssignCarrierPanel` fetches the carrier list and the session on mount, so
   * the render has to be awaited for those state updates to land. Without
   * this, React reports "not wrapped in act(...)" and the assertions race the
   * pending fetches.
   */
  async function renderLoadDetail() {
    const result = render(<LoadDetailClient load={load} />);
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/auth/me");
    });
    return result;
  }

  it("renders without throwing", async () => {
    await expect(renderLoadDetail()).resolves.not.toThrow();
  });

  it("shows the load number and route", async () => {
    await renderLoadDetail();

    expect(screen.getByText("LD-2024-0001")).toBeInTheDocument();
    expect(screen.getByText(/Chicago, IL/)).toBeInTheDocument();
    expect(screen.getByText(/Columbus, OH/)).toBeInTheDocument();
  });

  it("shows the core load facts", async () => {
    await renderLoadDetail();

    expect(screen.getByText("Northwind Freight")).toBeInTheDocument();
    expect(screen.getByText("Paper rolls")).toBeInTheDocument();
  });

  it("renders the assign panel for a POSTED load", async () => {
    await renderLoadDetail();

    expect(screen.getByText("Accept load")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Accept & assign carrier/i })
    ).toBeInTheDocument();
  });

  it("loads the carrier list and session from the BFF on mount", async () => {
    await renderLoadDetail();

    // These two BFF routes used to 404, which is why the carrier dropdown
    // stayed empty and the actor role stayed at its default.
    expect(fetchMock).toHaveBeenCalledWith("/api/carriers");
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me");
  });

  it("renders the eligibility panel", async () => {
    await renderLoadDetail();

    expect(
      screen.getByText("Load-specific carrier eligibility")
    ).toBeInTheDocument();
  });
});
