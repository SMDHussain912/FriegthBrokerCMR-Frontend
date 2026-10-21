/**
 * Dashboard metrics card — a single key value with optional delta.
 */

export function MetricCard({ title, value, delta, tone = "neutral" }) {
  const tones = {
    neutral: "text-mist-300 ring-ink-600",
    brand: "text-brand-300 ring-brand-500/25",
    pass: "text-pass-400 ring-pass-500/30",
    review: "text-review-400 ring-review-500/30",
    fail: "text-fail-400 ring-fail-500/30",
  };
  return (
    <section
      className={`rounded-panel border border-ink-700 bg-ink-900/70 ${tones[tone]}`}
    >
      <div className="flex items-end justify-between gap-2 px-5 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-mist-50 tabular-nums">
            {value}
          </p>
        </div>
        {delta ? (
          <span className="text-xs font-mono text-mist-500">{delta}</span>
        ) : null}
      </div>
    </section>
  );
}
