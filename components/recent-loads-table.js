import { LoadStatusBadge, Chip, DataTable } from "@/components/ui";
import { EmptyState } from "@/components/states";
import { formatCurrency, formatEquipment, formatRoute } from "@/lib/format";

const HEADERS = [
  { label: "Load #" },
  { label: "Route" },
  { label: "Shipper" },
  { label: "Equipment" },
  { label: "Status" },
  { label: "Value", align: "right" },
];

export function RecentLoadsTable({ loads }) {
  if (loads.length === 0) {
    return (
      <EmptyState
        title="No loads yet"
        description="Create a load to begin carrier vetting and dispatch."
      />
    );
  }

  return (
    <DataTable
      caption="Most recently created loads with their dispatch status and cargo value."
      headers={HEADERS}
    >
      {loads.map((load) => (
        <tr key={load._id} className="hover:bg-ink-800/50 transition-colors">
          <td className="px-4 py-3 font-mono text-xs text-mist-200">
            {load.loadNumber}
          </td>
          <td className="px-4 py-3 text-xs text-mist-200">
            {formatRoute(load.origin, load.destination)}
          </td>
          <td className="px-4 py-3 text-xs text-mist-300">{load.shipperName}</td>
          <td className="px-4 py-3 text-xs text-mist-300">
            <Chip tone="neutral">{formatEquipment(load.equipmentType)}</Chip>
          </td>
          <td className="px-4 py-3 text-xs">
            <LoadStatusBadge status={load.status} size="sm" />
          </td>
          <td className="px-4 py-3 text-right text-xs font-mono tabular-nums text-mist-200">
            {formatCurrency(load.declaredCargoValue)}
          </td>
        </tr>
      ))}
    </DataTable>
  );
}
