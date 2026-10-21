import { describe, it, expect } from "vitest";
import {
  vettingStateStyle,
  vettingStateExplainer,
  loadStateStyle,
  formatCurrency,
  formatDate,
  formatEquipment,
  formatLoadStatus,
  formatRoute,
  formatReasonCode,
  coverageDeficit,
} from "@/lib/format";

describe("vettingStateStyle", () => {
  it("maps every vetting state to a distinct label", () => {
    const labels = ["PASS", "FAIL", "NEEDS_REVIEW", "UNKNOWN"].map(
      (state) => vettingStateStyle(state).label
    );
    expect(new Set(labels).size).toBe(4);
  });

  it("falls back to UNKNOWN styling for an unrecognised state", () => {
    expect(vettingStateStyle("NOT_A_STATE").label).toBe("Unknown");
    expect(vettingStateStyle(undefined).label).toBe("Unknown");
  });

  it("never lets a missing state borrow the PASS treatment", () => {
    // The single most important invariant in the product: absent evidence
    // must never be presented as a pass.
    expect(vettingStateStyle(undefined).badge).not.toBe(
      vettingStateStyle("PASS").badge
    );
    expect(vettingStateStyle(null).badge).not.toBe(
      vettingStateStyle("PASS").badge
    );
  });
});

describe("vettingStateExplainer", () => {
  it("explains each state in plain language", () => {
    for (const state of ["PASS", "FAIL", "NEEDS_REVIEW", "UNKNOWN"]) {
      expect(vettingStateExplainer(state).length).toBeGreaterThan(10);
    }
  });
});

describe("loadStateStyle", () => {
  it("gives each load lifecycle state its own label", () => {
    expect(loadStateStyle("POSTED").label).toBe("Posted");
    expect(loadStateStyle("ASSIGNED").label).toBe("Assigned");
    expect(loadStateStyle("IN_TRANSIT").label).toBe("In transit");
    expect(loadStateStyle("DELIVERED").label).toBe("Delivered");
    expect(loadStateStyle("CANCELLED").label).toBe("Cancelled");
  });

  it("is case insensitive", () => {
    expect(loadStateStyle("in_transit").label).toBe("In transit");
  });

  it("does not treat a cancelled load as a vetting failure", () => {
    // A cancelled load is a workflow state, not a compliance breach.
    expect(loadStateStyle("CANCELLED").badge).not.toBe(
      vettingStateStyle("FAIL").badge
    );
  });

  it("falls back to a neutral unknown for an unrecognised load status", () => {
    expect(loadStateStyle("TELEPORTED").label).toBe("Unknown");
    expect(loadStateStyle(undefined).label).toBe("Unknown");
  });
});

describe("formatCurrency", () => {
  it("formats whole-dollar amounts", () => {
    expect(formatCurrency(100000)).toBe("$100,000");
  });

  it("returns an em dash for missing values", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
    expect(formatCurrency("not a number")).toBe("—");
  });

  it("compacts thousands when asked", () => {
    expect(formatCurrency(100000, { compact: true })).toBe("$100k");
  });
});

describe("formatDate", () => {
  it("formats an ISO date consistently in UTC", () => {
    expect(formatDate("2026-03-14T00:00:00.000Z")).toBe("Mar 14, 2026");
  });

  it("returns an em dash for missing or invalid dates", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not a date")).toBe("—");
  });
});

describe("formatEquipment", () => {
  it("humanises equipment types", () => {
    expect(formatEquipment("DRY_VAN")).toBe("Dry van");
    expect(formatEquipment("REEFER")).toBe("Reefer");
  });

  it("passes through unknown values rather than hiding them", () => {
    expect(formatEquipment("INTERMODAL")).toBe("INTERMODAL");
  });
});

describe("formatLoadStatus", () => {
  it("converts SCREAMING_SNAKE to sentence case", () => {
    expect(formatLoadStatus("IN_TRANSIT")).toBe("In Transit");
  });

  it("handles a missing status", () => {
    expect(formatLoadStatus(null)).toBe("Unknown");
  });
});

describe("formatRoute", () => {
  it("renders a full origin to destination route", () => {
    expect(
      formatRoute({ city: "Chicago", state: "IL" }, { city: "Atlanta", state: "GA" })
    ).toBe("Chicago, IL → Atlanta, GA");
  });

  it("renders a partial route without inventing the missing end", () => {
    expect(formatRoute({ city: "Chicago", state: "IL" }, null)).toBe(
      "Chicago, IL"
    );
  });

  it("returns an em dash when nothing is known", () => {
    expect(formatRoute(null, null)).toBe("—");
  });
});

describe("formatReasonCode", () => {
  it("humanises a rule reason code", () => {
    expect(formatReasonCode("INSUFFICIENT_LIMIT")).toBe("Insufficient limit");
  });

  it("handles a missing code", () => {
    expect(formatReasonCode(null)).toBe("—");
  });
});

describe("coverageDeficit", () => {
  it("reports the shortfall when coverage is below the requirement", () => {
    expect(coverageDeficit(500000, 1000000)).toBe(500000);
  });

  it("returns null when coverage meets the requirement", () => {
    expect(coverageDeficit(1000000, 1000000)).toBeNull();
    expect(coverageDeficit(1000001, 1000000)).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(coverageDeficit("abc", 1000000)).toBeNull();
    expect(coverageDeficit(undefined, undefined)).toBeNull();
  });
});
