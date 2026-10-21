"use client";

import { DataPoint } from "@/components/ui";
import { formatDate } from "@/lib/format";

export function EvidenceDrawer({
  check,
  onClose,
}) {
  const styles = {
    PASS: { badge: "bg-pass-950 text-pass-400 ring-pass-500/30", dot: "bg-pass-500", label: "Pass" },
    FAIL: { badge: "bg-fail-950 text-fail-400 ring-fail-500/30", dot: "bg-fail-500", label: "Fail" },
    NEEDS_REVIEW: { badge: "bg-review-950 text-review-400 ring-review-500/30", dot: "bg-review-500", label: "Needs review" },
    UNKNOWN: { badge: "bg-unknown-950 text-unknown-400 ring-unknown-500/40", dot: "bg-unknown-500", label: "Unknown" },
  };
  const style = styles[check.status] || styles.UNKNOWN;

  const actualValue = check.evidence?.actualValue ?? check.actualValue;
  const requiredValue = check.evidence?.requiredValue ?? check.requiredValue;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 h-full max-h-[85vh] rounded-t-panel border border-ink-700 bg-ink-900 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
          <h3 className="text-sm font-semibold text-mist-50">Evidence detail</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-mist-500 hover:text-brand-400 transition-colors"
            aria-label="Close evidence drawer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-mist-500">Rule</p>
              <p className="text-sm font-medium text-mist-100">{check.ruleName}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.08em] ring-1 ring-inset ${style.badge} px-2.5 py-1 text-[11px]`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
              {style.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataPoint label="Reason code" value={check.reasonCode} mono />
            <DataPoint label="Required value" value={requiredValue ?? "—"} />
            <DataPoint label="Actual value" value={actualValue ?? "—"} />
            <DataPoint label="Evidence source" value={check.evidence?.source ?? "—"} />
            <DataPoint label="Evidence timestamp" value={formatDate(check.evidence?.timestamp ?? check.evidenceTimestamp)} />
            <DataPoint label="Is mock data" value={check.evidence?.isMock ? "Yes (demo)" : "No"} />
          </div>

          {check.notes && (
            <div className="border-t border-ink-700 pt-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Notes</p>
              <p className="mt-1 text-xs text-mist-300 leading-relaxed">{check.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
