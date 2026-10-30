/**
 * Carriers list — every carrier in the brokerage with vetting status.
 *
 * Fetches at request time (no caching). Clicking a carrier opens its detail
 * page with global vetting evaluation and insurance policy verification.
 */

import Link from "next/link";
import { Panel, PanelHeader, StatusBadge, DataTable } from "@/components/ui";
import { EmptyState, TableSkeleton } from "@/components/states";
import { listCarriers } from "@/lib/data";
import { Suspense } from "react";

const HEADERS = [
  { label: "Carrier" },
  { label: "DOT / MC" },
  { label: "Authority" },
  { label: "Safety rating" },
  { label: "Vetting" },
  { label: "Data" },
];

export default async function CarriersPage() {
  let carriers = [];
  let carriersError = null;

  try {
    carriers = await listCarriers();
  } catch (error) {
    carriersError = error instanceof Error ? error.message : "Failed to load carriers";
    carriers = [];
  }

  if (carriersError && carriers.length === 0) {
    return (
      <Panel>
        <PanelHeader title="Carriers" description="Error loading carriers data." />
        <div className="p-4 text-red-400">{carriersError}</div>
      </Panel>
    );
  }

  if (carriers.length === 0) {
    return (
      <Panel>
        <PanelHeader title="Carriers" description="No carriers in the brokerage." />
        <EmptyState
          title="No carriers yet"
          description="Add carriers to begin vetting and assignment."
        />
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Carriers"
        description={`${carriers.length} carrier${carriers.length !== 1 ? "s" : ""} in the brokerage`}
      />
      <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
        <DataTable
          caption={`Carriers in the brokerage, with vetting status and authority information.`}
          headers={HEADERS}
        >
          {carriers.map((carrier) => (
            <tr
              key={carrier._id}
              className="hover:bg-ink-800/50 transition-colors"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/carriers/${carrier._id}`}
                  className="font-mono text-xs text-brand-300 hover:underline"
                >
                  {carrier.legalName}
                </Link>
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
              <td className="px-4 py-3 text-xs text-mist-500">
                {carrier.isDemoData ? "demo" : "live"}
              </td>
            </tr>
          ))}
        </DataTable>
      </Suspense>
    </div>
  );
}
