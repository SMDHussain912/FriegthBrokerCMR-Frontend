/**
 * Shared state primitives.
 *
 * Every data-backed view in the console renders one of these three states so
 * the app never shows a blank panel or a raw stack trace.
 */

export function EmptyState({ title, description, action, icon = "◎" }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-lg text-mist-400"
      >
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-mist-100">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-mist-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, action, code }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-fail-500/30 bg-fail-950 text-lg text-fail-400"
      >
        !
      </span>
      <h3 className="text-sm font-semibold text-mist-100">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-mist-300">{description}</p>
      ) : null}
      {code ? (
        <code className="mt-3 rounded-md bg-ink-850 px-2 py-1 font-mono text-[11px] text-mist-400">
          {code}
        </code>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-ink-600 border-t-brand-400"
      />
      <p className="text-xs text-mist-400">{label}</p>
    </div>
  );
}

/** Skeleton rows for list views — keeps layout stable while data streams in. */
export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="divide-y divide-ink-800">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <div
              key={colIndex}
              className="h-3 animate-pulse rounded bg-ink-800"
              style={{ width: `${[28, 18, 14, 12, 10][colIndex] ?? 12}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
