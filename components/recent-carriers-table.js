import { StatusBadge } from "@/components/ui";
import { EmptyState } from "@/components/states";

export function RecentCarriersTable({ carriers }) {
  if (carriers.length === 0) {
    return (
      <EmptyState
        title="No carriers yet"
        description="Add carriers to begin vetting and assignment."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900/70">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-850">
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Carrier
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              DOT / MC
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Authority
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Safety
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Vetting
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">
          {carriers.map((carrier) => (
            <tr key={carrier._id} className="hover:bg-ink-800/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-mist-200">
                {carrier.legalName}
              </td>
              <td className="px-4 py-3 text-xs text-mist-300">
                {carrier.dotNumber} / {carrier.mcNumber}
              </td>
              <td className="px-4 py-3 text-xs text-mist-300">
                {carrier.authorityStatus}
              </td>
              <td className="px-4 py-3 text-xs text-mist-300">
                {carrier.safetyRating}
              </td>
              <td className="px-4 py-3 text-xs">
                <StatusBadge status={carrier.overallStatus} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
