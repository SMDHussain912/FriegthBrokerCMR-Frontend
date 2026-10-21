/**
 * Carriers list — every carrier in the brokerage with vetting status.
 *
 * Fetches at request time (no caching). Clicking a carrier opens its detail
 * page with global vetting evaluation and insurance policy verification.
 */

import Link from "next/link";
import { Panel, PanelHeader, StatusBadge, Chip } from "@/components/ui";
import { EmptyState, TableSkeleton } from "@/components/states";
import { listCarriers } from "@/lib/data";
import { Suspense } from "react";

export default async function CarriersPage() {
  const carriers = await listCarriers();

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
                  Safety rating
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
                  Vetting
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">
                  Demo data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
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
                  <td className="px-4 py-3 text-xs text-mist-500">
                    {carrier.isDemoData ? "demo" : "live"}
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
