import { vettingStateStyle, loadStateStyle } from "@/lib/format";

/** Panel: the raised surface used for every card in the console. */
export function Panel({ className = "", children }) {
  return (
    <section
      className={`rounded-panel border border-ink-700 bg-ink-900/70 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_12px_32px_-16px_rgba(0,0,0,0.8)] ${className}`}
    >
      {children}
    </section>
  );
}

export function PanelHeader({ title, description, action }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-700 px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-mist-50">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-mist-400">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

/** The four-state status pill. */
export function StatusBadge({ status, size = "md", className = "" }) {
  const style = vettingStateStyle(status);
  const sizing =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.08em] ring-1 ring-inset ${style.badge} ${sizing} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}

/**
 * Load lifecycle pill.
 *
 * Deliberately separate from `StatusBadge`: a load's status is a workflow
 * state, not a vetting outcome. Reusing the vetting badge here made every
 * load render as "Unknown" and would have shown a CANCELLED load with the
 * FAIL treatment.
 */
export function LoadStatusBadge({ status, size = "md", className = "" }) {
  const style = loadStateStyle(status);
  const sizing =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-[0.08em] ring-1 ring-inset ${style.badge} ${sizing} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}

/**
 * Data table shell.
 *
 * Every data table in the console shares the same high-density treatment from
 * the design system: a 36px header strip on the card surface, hairline row
 * dividers, a subtle hover wash and left-edge glow on the selected record.
 *
 * Accessibility is handled here so no table can forget it: the caption is
 * rendered (visually hidden by default) and every column header carries
 * `scope="col"`.
 */
export function DataTable({
  caption,
  headers,
  children,
  className = "",
}) {
  return (
    <div
      className={`overflow-x-auto overflow-hidden rounded-lg border border-ink-700 bg-ink-900/70 ${className}`}
    >
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink-700 bg-ink-850">
            {headers.map((header) => (
              <th
                key={header.label}
                scope="col"
                className={`px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500 ${
                  header.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">{children}</tbody>
      </table>
    </div>
  );
}

/** Neutral badge for non-vetting metadata (load status, equipment type). */
export function Chip({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-ink-800 text-mist-300 ring-ink-600",
    brand: "bg-brand-500/10 text-brand-300 ring-brand-500/25",
    pass: "bg-pass-950 text-pass-400 ring-pass-500/30",
    review: "bg-review-950 text-review-400 ring-review-500/30",
    fail: "bg-fail-950 text-fail-400 ring-fail-500/30",
    unknown: "bg-unknown-950 text-unknown-400 ring-unknown-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Key/value pair used across the dossier panels. */
export function DataPoint({ label, value, mono = false, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-mist-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-mist-100 ${mono ? "font-mono tabular-nums" : ""}`}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
