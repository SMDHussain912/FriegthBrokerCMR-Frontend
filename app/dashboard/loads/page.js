/**
 * Loads list — every load in the brokerage with vetting status.
 *
 * Fetches at request time (no caching). Clicking a load opens its detail
 * page with load-specific eligibility evaluation and the evidence drawer.
 */

import Link from "next/link";
import { Panel, PanelHeader, LoadStatusBadge, Chip, DataTable } from "@/components/ui";
import { EmptyState, TableSkeleton } from "@/components/states";
import { listLoads } from "@/lib/data";
import { getSessionToken } from "@/lib/session";
import { formatCurrency, formatEquipment, formatRoute } from "@/lib/format";
import { Suspense } from "react";

const HEADERS = [
  { label: "Load #" },
  { label: "Route" },
  { label: "Shipper" },
  { label: "Equipment" },
  { label: "Status" },
  { label: "Assigned carrier" },
  { label: "Value", align: "right" },
];

export default async function LoadsPage() {
  let loads = [];
  let loadsError = null;

  try {
    const token = await getSessionToken();
    loads = await listLoads({}, { token });
  } catch (error) {
    loadsError = error instanceof Error ? error.message : "Failed to load loads";
    loads = [];
  }

  if (loadsError && loads.length === 0) {
    return (
      <Panel>
        <PanelHeader title="Loads" description="Error loading loads data." />
        <div className="p-4 text-red-400">{loadsError}</div>
      </Panel>
    );
  }

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
        <DataTable
          caption="Loads in the brokerage, with status, assigned carrier and declared cargo value."
          headers={HEADERS}
        >
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
                {formatRoute(load.origin, load.destination)}
              </td>
              <td className="px-4 py-3 text-xs text-mist-300">
                {load.shipperName}
              </td>
              <td className="px-4 py-3 text-xs text-mist-300">
                <Chip tone="neutral">{formatEquipment(load.equipmentType)}</Chip>
              </td>
              <td className="px-4 py-3 text-xs">
                <LoadStatusBadge status={load.status} size="sm" />
              </td>
              <td className="px-4 py-3 text-xs text-mist-300">
                {load.assignedCarrier?.legalName || "—"}
              </td>
              <td className="px-4 py-3 text-right text-xs font-mono tabular-nums text-mist-200">
                {formatCurrency(load.declaredCargoValue)}
              </td>
            </tr>
          ))}
        </DataTable>
      </Suspense>
    </div>
  );
}
