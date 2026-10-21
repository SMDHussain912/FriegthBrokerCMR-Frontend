import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge, LoadStatusBadge, DataTable, Chip } from "@/components/ui";

describe("StatusBadge", () => {
  it("renders the human label for a vetting state", () => {
    render(<StatusBadge status="PASS" />);
    expect(screen.getByText("Pass")).toBeInTheDocument();
  });

  it("renders each of the four vetting states", () => {
    for (const [status, label] of [
      ["PASS", "Pass"],
      ["FAIL", "Fail"],
      ["NEEDS_REVIEW", "Needs review"],
      ["UNKNOWN", "Unknown"],
    ]) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it("never communicates status by colour alone", () => {
    // The design system forbids colour-only status: the text label is what
    // makes the badge readable to a screen reader and to a colour-blind user.
    render(<StatusBadge status="FAIL" />);
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("falls back to Unknown for an unrecognised state", () => {
    render(<StatusBadge status="MADE_UP" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});

describe("LoadStatusBadge", () => {
  it("renders the load lifecycle label", () => {
    render(<LoadStatusBadge status="IN_TRANSIT" />);
    expect(screen.getByText("In transit")).toBeInTheDocument();
  });

  it("does not render a load status as a vetting outcome", () => {
    // Regression guard: the loads table previously passed the load status
    // into the vetting badge, so every load displayed "Unknown".
    render(<LoadStatusBadge status="POSTED" />);
    expect(screen.queryByText("Pass")).not.toBeInTheDocument();
    expect(screen.queryByText("Fail")).not.toBeInTheDocument();
    expect(screen.getByText("Posted")).toBeInTheDocument();
  });

  it("distinguishes a cancelled load from a vetting failure", () => {
    render(<LoadStatusBadge status="CANCELLED" />);
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });
});

describe("Chip", () => {
  it("renders its children", () => {
    render(<Chip>Dry van</Chip>);
    expect(screen.getByText("Dry van")).toBeInTheDocument();
  });
});

describe("DataTable", () => {
  const headers = [
    { label: "Carrier" },
    { label: "Value", align: "right" },
  ];

  it("renders a caption for screen readers", () => {
    render(
      <DataTable caption="Carriers in the brokerage." headers={headers}>
        <tr>
          <td>Acme</td>
          <td>$100</td>
        </tr>
      </DataTable>
    );
    expect(screen.getByText("Carriers in the brokerage.")).toBeInTheDocument();
  });

  it("gives every column header a scope", () => {
    render(
      <DataTable caption="Carriers" headers={headers}>
        <tr>
          <td>Acme</td>
          <td>$100</td>
        </tr>
      </DataTable>
    );
    const ths = screen.getAllByRole("columnheader");
    expect(ths).toHaveLength(2);
    for (const th of ths) {
      expect(th).toHaveAttribute("scope", "col");
    }
  });

  it("renders the rows it is given", () => {
    render(
      <DataTable caption="Carriers" headers={headers}>
        <tr>
          <td>Acme</td>
          <td>$100</td>
        </tr>
      </DataTable>
    );
    // One header row plus one body row.
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(
      screen.getByRole("columnheader", { name: "Carrier" })
    ).toBeInTheDocument();
  });
});
