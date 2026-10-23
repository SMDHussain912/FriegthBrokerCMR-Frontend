import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

// The BFF routes call the backend through `apiFetch` and read the session
// cookie through `getSessionToken`. Both are mocked so the tests assert the
// BFF's own contract — status codes, query forwarding, error mapping —
// without needing a running backend or a real cookie jar.
const apiFetch = vi.fn();
const getSessionToken = vi.fn();

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    apiFetch: (...args) => apiFetch(...args),
  };
});

vi.mock("@/lib/session", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSessionToken: (...args) => getSessionToken(...args),
  };
});

const { GET: getCarriers } = await import("@/app/api/carriers/route");
const { GET: getLoads } = await import("@/app/api/loads/route");
const { GET: getSession } = await import("@/app/api/auth/me/route");

const request = (url) => new Request(url);

describe("BFF GET /api/carriers", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    getSessionToken.mockReset();
    getSessionToken.mockResolvedValue(null);
  });

  it("returns the carrier list with a 200", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 1, carriers: [{ _id: "c1" }] });

    const response = await getCarriers(request("http://localhost:3000/api/carriers"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.carriers).toHaveLength(1);
  });

  it("regression: this route used to 404 because it did not exist", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 0, carriers: [] });

    const response = await getCarriers(request("http://localhost:3000/api/carriers"));

    // The route must be reachable and must not answer 404.
    expect(response.status).not.toBe(404);
    expect(response.status).toBe(200);
  });

  it("forwards the query and status filters to the backend", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 0, carriers: [] });

    await getCarriers(request("http://localhost:3000/api/carriers?query=swift&status=pass"));

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/carriers?query=swift&status=pass",
      expect.objectContaining({ token: null })
    );
  });

  it("drops query parameters the backend does not understand", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 0, carriers: [] });

    await getCarriers(request("http://localhost:3000/api/carriers?injected=1"));

    expect(apiFetch).toHaveBeenCalledWith("/api/carriers", expect.anything());
  });

  it("attaches the session token when one is present", async () => {
    getSessionToken.mockResolvedValue("token-abc");
    apiFetch.mockResolvedValue({ success: true, count: 0, carriers: [] });

    await getCarriers(request("http://localhost:3000/api/carriers"));

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/carriers",
      expect.objectContaining({ token: "token-abc" })
    );
  });

  it("maps a backend error onto the same status code", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetch.mockRejectedValue(new ApiError("Backend exploded", { status: 503 }));

    const response = await getCarriers(request("http://localhost:3000/api/carriers"));

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Backend exploded");
  });

  it("returns 500 for a non-API error", async () => {
    apiFetch.mockRejectedValue(new Error("boom"));

    const response = await getCarriers(request("http://localhost:3000/api/carriers"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});

describe("BFF GET /api/loads", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    getSessionToken.mockReset();
    getSessionToken.mockResolvedValue(null);
  });

  it("returns the load list with a 200", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 1, loads: [{ _id: "l1" }] });

    const response = await getLoads(request("http://localhost:3000/api/loads"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.loads).toHaveLength(1);
  });

  it("regression: this route used to 405 because only POST was exported", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 0, loads: [] });

    const response = await getLoads(request("http://localhost:3000/api/loads"));

    // The method must be allowed, and must not answer 405.
    expect(response.status).not.toBe(405);
    expect(response.status).toBe(200);
  });

  it("forwards the status and equipmentType filters to the backend", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 0, loads: [] });

    await getLoads(request("http://localhost:3000/api/loads?status=POSTED&equipmentType=reefer"));

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/loads?status=POSTED&equipmentType=reefer",
      expect.objectContaining({ token: null })
    );
  });

  it("drops query parameters the backend does not understand", async () => {
    apiFetch.mockResolvedValue({ success: true, count: 0, loads: [] });

    await getLoads(request("http://localhost:3000/api/loads?injected=1"));

    expect(apiFetch).toHaveBeenCalledWith("/api/loads", expect.anything());
  });

  it("maps a backend error onto the same status code", async () => {
    const { ApiError } = await import("@/lib/api");
    apiFetch.mockRejectedValue(new ApiError("Backend exploded", { status: 500 }));

    const response = await getLoads(request("http://localhost:3000/api/loads"));

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});

describe("BFF GET /api/auth/me", () => {
  beforeEach(() => {
    apiFetch.mockReset();
    getSessionToken.mockReset();
  });

  it("returns the session user with a 200", async () => {
    getSessionToken.mockResolvedValue("token-abc");
    apiFetch.mockResolvedValue({ success: true, user: { id: "u1", role: "broker" } });

    const response = await getSession(request("http://localhost:3000/api/auth/me"));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user.role).toBe("broker");
  });

  it("regression: this route used to 404 because it did not exist", async () => {
    getSessionToken.mockResolvedValue("token-abc");
    apiFetch.mockResolvedValue({ success: true, user: { id: "u1", role: "broker" } });

    const response = await getSession(request("http://localhost:3000/api/auth/me"));

    expect(response.status).not.toBe(404);
    expect(response.status).toBe(200);
  });

  it("returns 401 when there is no session", async () => {
    getSessionToken.mockResolvedValue(null);

    const response = await getSession(request("http://localhost:3000/api/auth/me"));

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it("returns 401 when the backend rejects the session token", async () => {
    const { ApiError } = await import("@/lib/api");
    getSessionToken.mockResolvedValue("expired-token");
    apiFetch.mockRejectedValue(new ApiError("Not authorized", { status: 401 }));

    const response = await getSession(request("http://localhost:3000/api/auth/me"));

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it("forwards the session token to the backend", async () => {
    getSessionToken.mockResolvedValue("token-abc");
    apiFetch.mockResolvedValue({ success: true, user: { id: "u1" } });

    await getSession(request("http://localhost:3000/api/auth/me"));

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({ token: "token-abc" })
    );
  });
});
