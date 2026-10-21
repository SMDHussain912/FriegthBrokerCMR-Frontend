/**
 * Domain presentation helpers.
 *
 * The vetting engine speaks in four states. These helpers keep the mapping
 * from engine state -> visual language in one place so a status badge, a
 * table cell, and a filter chip can never disagree with each other.
 */

export const VETTING_STATES = ["PASS", "FAIL", "NEEDS_REVIEW", "UNKNOWN"];

const STATE_STYLES = {
  PASS: {
    label: "Pass",
    badge: "bg-pass-950 text-pass-400 ring-pass-500/30",
    dot: "bg-pass-500",
    accent: "text-pass-400",
    bar: "bg-pass-500",
    headline: "Cleared for dispatch",
  },
  FAIL: {
    label: "Fail",
    badge: "bg-fail-950 text-fail-400 ring-fail-500/30",
    dot: "bg-fail-500",
    accent: "text-fail-400",
    bar: "bg-fail-500",
    headline: "Blocked — hard threshold breach",
  },
  NEEDS_REVIEW: {
    label: "Needs review",
    badge: "bg-review-950 text-review-400 ring-review-500/30",
    dot: "bg-review-500",
    accent: "text-review-400",
    bar: "bg-review-500",
    headline: "Held for compliance review",
  },
  UNKNOWN: {
    label: "Unknown",
    badge: "bg-unknown-950 text-unknown-400 ring-unknown-500/40",
    dot: "bg-unknown-500",
    accent: "text-unknown-400",
    bar: "bg-unknown-500",
    headline: "Insufficient evidence",
  },
};

export function vettingStateStyle(state) {
  return STATE_STYLES[state] ?? STATE_STYLES.UNKNOWN;
}

/** Human sentence explaining what a state means operationally. */
export function vettingStateExplainer(state) {
  switch (state) {
    case "PASS":
      return "Every rule passed on verified, fresh, consistent evidence.";
    case "FAIL":
      return "At least one rule breached a mandatory threshold. Assignment is blocked.";
    case "NEEDS_REVIEW":
      return "Evidence is unverified, stale, or conflicting. A compliance officer must reconcile it.";
    case "UNKNOWN":
      return "Required evidence is missing. Missing data never counts as a pass.";
    default:
      return "No evaluation result available.";
  }
}

/**
 * Load lifecycle states.
 *
 * These are *not* vetting outcomes — a load in transit is not "Pass" and a
 * cancelled load is not "Fail". They get their own visual language so a
 * cancelled load never borrows the FAIL badge, and so an unknown load status
 * can never silently render as the neutral UNKNOWN vetting pill.
 */
const LOAD_STATE_STYLES = {
  POSTED: {
    label: "Posted",
    badge: "bg-ink-800 text-mist-200 ring-ink-600",
    dot: "bg-mist-300",
  },
  ASSIGNED: {
    label: "Assigned",
    badge: "bg-brand-500/10 text-brand-300 ring-brand-500/30",
    dot: "bg-brand-500",
  },
  IN_TRANSIT: {
    label: "In transit",
    badge: "bg-brand-500/15 text-brand-200 ring-brand-500/40",
    dot: "bg-brand-400",
  },
  DELIVERED: {
    label: "Delivered",
    badge: "bg-pass-950 text-pass-400 ring-pass-500/30",
    dot: "bg-pass-500",
  },
  CANCELLED: {
    // Deliberately *not* the FAIL palette. The red family is reserved for
    // compliance breaches; a cancelled load is a closed workflow, not a risk
    // signal, and must never read as a carrier failing vetting.
    label: "Cancelled",
    badge: "bg-ink-800 text-mist-400 ring-ink-600",
    dot: "bg-mist-500",
  },
};

/**
 * Style for a load lifecycle state. Unknown statuses render as a neutral
 * "Unknown" pill rather than borrowing a vetting state's colours.
 */
export function loadStateStyle(status) {
  const key = String(status ?? "").toUpperCase();
  return (
    LOAD_STATE_STYLES[key] ?? {
      label: "Unknown",
      badge: "bg-unknown-950 text-unknown-400 ring-unknown-500/40",
      dot: "bg-unknown-500",
    }
  );
}

export function formatCurrency(value, { compact = false } = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const amount = Number(value);
  if (compact && Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatDate(value, { withTime = false } = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...(withTime
      ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" }
      : {}),
  });
}

export function formatEquipment(type) {
  if (!type) return "—";
  const map = {
    DRY_VAN: "Dry van",
    REEFER: "Reefer",
    FLATBED: "Flatbed",
  };
  return map[type] ?? type;
}

export function formatLoadStatus(status) {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRoute(origin, destination) {
  const from = origin?.city && origin?.state ? `${origin.city}, ${origin.state}` : null;
  const to = destination?.city && destination?.state ? `${destination.city}, ${destination.state}` : null;
  if (from && to) return `${from} → ${to}`;
  return from || to || "—";
}

/**
 * Turns a reason code such as INSUFFICIENT_LIMIT into a readable label.
 * The engine ships SCREAMING_SNAKE_CODES; the UI prefers sentence case.
 */
export function formatReasonCode(code) {
  if (!code) return "—";
  return code
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}

/**
 * Compares a numeric actual value against a numeric required value to surface
 * the size of a coverage deficit — the single most useful number for a broker.
 */
export function coverageDeficit(actualValue, requiredValue) {
  const actual = Number(actualValue);
  const required = Number(requiredValue);
  if (!Number.isFinite(actual) || !Number.isFinite(required)) return null;
  if (actual >= required) return null;
  return required - actual;
}
