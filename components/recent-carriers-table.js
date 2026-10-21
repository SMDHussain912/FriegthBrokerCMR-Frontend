import { StatusBadge, DataTable } from "@/components/ui";
import { EmptyState } from "@/components/states";

const HEADERS = [
  { label: "Carrier" },
  { label: "DOT / MC" },
  { label: "Authority" },
  { label: "Safety" },
  { label: "Vetting" },
];

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
    <DataTable
      caption="Most recently created carriers and their vetting status."
      headers={HEADERS}
    >
      {carriers.map((carrier) => (
        <tr key={carrier._id} className="hover:bg-ink-800/50 transition-colors">
          <td className="px-4 py-3 font-mono text-xs text-mist-200">
            {carrier.legalName}
          </td>
          <td className="px-4 py-3 text-xs font-mono text-mist-300">
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
    </DataTable>
  );
}
