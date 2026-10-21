/**
 * Loads list — every load in the brokerage with vetting status.
 *
 * Fetches at request time (no caching). Clicking a load opens its detail
 * page with load-specific eligibility evaluation and the evidence drawer.
 */

import Link from "next/link";
import { Panel, PanelHeader, StatusBadge, Chip } from "@/components/ui";
import { EmptyState, TableSkeleton } from "@/components/states";
import { listLoads } from "@/lib/data";
import {
  formatCurrency,
  formatDate,
  formatEquipment,
  formatLoadStatus,
} from "@/lib/format";
import { Suspense } from "react";

export default async function LoadsPage() {
  const loads = await listLoads();

  if (loads.length === 0) {
    return (
      <Panel>
        <PanelHeader title="Loads" description="No loads in the brokerage." />
        <EmptyState
          title="No loads yet"
          description="Create a load to begin carrier vetting and dispatch."
        />
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Loads"
        description={`${loads.length} load${loads.length !== 1 ? "s" : ""} in the brokerage`}
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={7} />}>
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
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
                  Assigned carrier
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {loads.map((load) => (
                <tr
                  key={load._id}
                  className="hover:bg-ink-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/loads/${load._id}`}
                      className="font-mono text-xs text-brand-300 hover:underline"
                    >
                      {load.loadNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-mist-200">
                    {load.origin?.city}, {load.origin?.state} →{" "}
                    {load.destination?.city}, {load.destination?.state}
                  </td>
                  <td className="px-4 py-3 text-xs text-mist-300">
                    {load.shipperName}
                  </td>
                  <td className="px-4 py-3 text-xs text-mist-300">
                    <Chip tone="neutral">{formatEquipment(load.equipmentType)}</Chip>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <StatusBadge status={load.status.toLowerCase()} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-xs text-mist-300">
                    {load.assignedCarrier?.legalName || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-mono tabular-nums text-mist-200">
                    {formatCurrency(load.declaredCargoValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Suspense>
    </div>
  );
}
