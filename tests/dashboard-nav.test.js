import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardNav } from "@/components/dashboard-nav";

// The nav reads the current path from next/navigation. We control it so the
// test can assert the active state for any route.
let mockPathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const activeLink = () =>
  screen.getByRole("link", { current: "page" });

describe("DashboardNav", () => {
  beforeEach(() => {
    mockPathname = "/dashboard";
  });

  it("renders every console section", () => {
    render(<DashboardNav />);
    expect(screen.getByRole("link", { name: /Dashboard/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Loads/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Carriers/ })).toBeInTheDocument();
  });

  it("marks exactly one item as the current page", () => {
    render(<DashboardNav />);
    expect(activeLink()).toHaveTextContent("Dashboard");
  });

  it("activates the Loads section on the loads route", () => {
    mockPathname = "/dashboard/loads";
    render(<DashboardNav />);
    expect(activeLink()).toHaveTextContent("Loads");
  });

  it("keeps Carriers active on a nested carrier detail route", () => {
    // Regression guard: the previous implementation compared the path with
    // strict equality against "/dashboard/carriers", so a detail page
    // highlighted nothing at all.
    mockPathname = "/dashboard/carriers/65f0000000000000000000aa";
    render(<DashboardNav />);
    expect(activeLink()).toHaveTextContent("Carriers");
  });

  it("does not activate the index route for nested paths", () => {
    mockPathname = "/dashboard/loads/65f0000000000000000000aa";
    render(<DashboardNav />);
    expect(activeLink()).toHaveTextContent("Loads");
    expect(
      screen.getByRole("link", { name: /Dashboard/ })
    ).not.toHaveAttribute("aria-current");
  });

  it("exposes a labelled navigation landmark", () => {
    render(<DashboardNav />);
    expect(
      screen.getByRole("navigation", { name: "Console sections" })
    ).toBeInTheDocument();
  });
});
