import { StatusBadge, Chip } from "@/components/ui";
import { EmptyState } from "@/components/states";
import { formatCurrency, formatEquipment } from "@/lib/format";

function formatRoute(origin, destination) {
  const from = origin?.city && origin?.state ? `${origin.city}, ${origin.state}` : null;
  const to = destination?.city && destination?.state ? `${destination.city}, ${destination.state}` : null;
  if (from && to) return `${from} → ${to}`;
  return from || to || "—";
}

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
    <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900/70">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-850">
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Load #
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Route
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Shipper
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Equipment
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">
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
                <StatusBadge status={load.status.toLowerCase()} size="sm" />
              </td>
              <td className="px-4 py-3 text-right text-xs font-mono tabular-nums text-mist-200">
                {formatCurrency(load.declaredCargoValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
