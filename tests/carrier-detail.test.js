import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarrierDetailClient } from "@/components/carrier-detail-client";

const carrier = {
  _id: "carrier-1",
  legalName: "Acme Freight LLC",
  dbaName: "Acme",
  dotNumber: "1234567",
  mcNumber: "MC-987654",
  authorityStatus: "ACTIVE",
  authorityGrantDate: "2020-01-15T00:00:00.000Z",
  safetyRating: "SATISFACTORY",
  overallStatus: "PASS",
  isDemoData: true,
  contact: {
    phone: "555-0100",
    email: "ops@acme.example",
    address: { street: "1 Dock Rd", city: "Chicago", state: "IL", zip: "60601" },
  },
  fmcsaMetrics: {
    unsafeDrivingPercentile: 10,
    hosCompliancePercentile: 20,
    vehicleMaintPercentile: 30,
    crashTotal: 1,
    lastFmcsaCheck: "2026-01-10T00:00:00.000Z",
  },
  insurancePolicies: [],
};

const vetting = {
  overallStatus: "PASS",
  ruleVersion: "v1.0.0",
  summary: { passedChecks: 4, failedChecks: 0, reviewChecks: 0, unknownChecks: 0 },
  checks: [
    {
      ruleKey: "AUTHORITY_ACTIVE",
      ruleName: "Operating authority active",
      reasonCode: "AUTHORITY_ACTIVE",
      status: "PASS",
    },
  ],
};

describe("CarrierDetailClient", () => {
  it("renders the carrier dossier without throwing", () => {
    // Regression guard: this component previously referenced an undefined
    // `error` binding, which made /dashboard/carriers/[id] return HTTP 500.
    expect(() =>
      render(<CarrierDetailClient carrier={carrier} vetting={vetting} />)
    ).not.toThrow();
  });

  it("shows the carrier identity and DOT / MC numbers", () => {
    render(<CarrierDetailClient carrier={carrier} vetting={vetting} />);
    expect(screen.getByText("Acme Freight LLC")).toBeInTheDocument();
    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("MC-987654")).toBeInTheDocument();
  });

  it("renders the vetting result and its checks", () => {
    render(<CarrierDetailClient carrier={carrier} vetting={vetting} />);
    expect(screen.getByText("Vetting result")).toBeInTheDocument();
    expect(screen.getByText("Operating authority active")).toBeInTheDocument();
  });

  it("surfaces a vetting error without blanking the dossier", () => {
    render(
      <CarrierDetailClient
        carrier={carrier}
        vetting={null}
        vettingError="Vetting evaluation could not be loaded."
      />
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Vetting evaluation could not be loaded.");
    // The dossier itself is still present.
    expect(screen.getByText("Acme Freight LLC")).toBeInTheDocument();
  });

  it("shows an empty state when no evaluation is available and no error occurred", () => {
    render(<CarrierDetailClient carrier={carrier} vetting={null} />);
    expect(screen.getByText("No vetting evaluation available.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
