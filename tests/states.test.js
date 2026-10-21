import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  TableSkeleton,
} from "@/components/states";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        title="No loads yet"
        description="Create a load to begin carrier vetting and dispatch."
      />
    );
    expect(screen.getByText("No loads yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create a load to begin carrier vetting and dispatch.")
    ).toBeInTheDocument();
  });

  it("renders nothing when no description is supplied", () => {
    render(<EmptyState title="All up to date" />);
    expect(screen.getByText("All up to date")).toBeInTheDocument();
    expect(
      screen.queryByText(/description/, { exact: false })
    ).not.toBeInTheDocument();
  });

  it("renders an optional action", () => {
    render(
      <EmptyState
        title="No loads yet"
        action={<button>Create first load</button>}
      />
    );
    expect(screen.getByRole("button", { name: /create first load/i })).toBeInTheDocument();
  });

  it("exposes the icon as decorative only", () => {
    render(<EmptyState title="No loads yet" icon="⊘" />);
    const icon = screen.getByText("⊘");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByText("⊘", { selector: "p, h3" })).not.toBeInTheDocument();
  });
});

describe("LoadingState", () => {
  it("announces itself as a status region", () => {
    render(<LoadingState />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("reads the provided label", () => {
    render(<LoadingState label="Fetching evidence…" />);
    expect(screen.getByText("Fetching evidence…")).toBeInTheDocument();
  });

  it("defaults to a loading label", () => {
    render(<LoadingState />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

describe("ErrorState", () => {
  it("uses the default title when none is given", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a custom code block", () => {
    render(<ErrorState code="ERR_NETWORK_TIMEOUT" />);
    expect(screen.getByText("ERR_NETWORK_TIMEOUT")).toBeInTheDocument();
    expect(screen.getByText("ERR_NETWORK_TIMEOUT").tagName).toBe("CODE");
  });
});

describe("TableSkeleton", () => {
  it("renders the requested number of rows and columns", () => {
    const { container } = render(<TableSkeleton rows={4} columns={3} />);
    // Each cell is an `.animate-pulse` div: rows * columns total.
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(4 * 3);
  });

  it("honours its defaults", () => {
    const { container } = render(<TableSkeleton />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(5 * 5);
  });
});
