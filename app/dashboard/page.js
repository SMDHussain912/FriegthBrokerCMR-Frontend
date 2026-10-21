/**
 * Dashboard — control tower overview.
 *
 * Surface key metrics at a glance: load volume by status, carrier vetting
 * distribution, and recent activity. All data is fetched at request time
 * (no caching) because compliance state changes whenever a broker verifies
 * a policy or assigns a carrier.
 */

import Link from "next/link";
import { Panel, PanelHeader } from "@/components/ui";
import { TableSkeleton } from "@/components/states";
import { MetricCard } from "@/components/dashboard-metric";
import { RecentLoadsTable } from "@/components/recent-loads-table";
import { RecentCarriersTable } from "@/components/recent-carriers-table";
import { listLoads, listCarriers } from "@/lib/data";
import { Suspense } from "react";

async function getDashboardMetrics() {
  const [loads, carriers] = await Promise.all([listLoads(), listCarriers()]);

  const loadStatusCounts = loads.reduce(
    (acc, load) => {
      acc[load.status] = (acc[load.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const carrierStatusCounts = carriers.reduce(
    (acc, carrier) => {
      acc[carrier.overallStatus] = (acc[carrier.overallStatus] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalLoads: loads.length,
    totalCarriers: carriers.length,
    loadStatusCounts,
    carrierStatusCounts,
    recentLoads: loads.slice(0, 5),
    recentCarriers: carriers.slice(0, 5),
  };
}

export default async function DashboardPage() {
  const {
    totalLoads,
    totalCarriers,
    loadStatusCounts,
    carrierStatusCounts,
    recentLoads,
    recentCarriers,
  } = await getDashboardMetrics();

  const postedCount = loadStatusCounts.POSTED || 0;
  const assignedCount = loadStatusCounts.ASSIGNED || 0;
  const inTransitCount = loadStatusCounts.IN_TRANSIT || 0;
  const deliveredCount = loadStatusCounts.DELIVERED || 0;

  const passCount = carrierStatusCounts.PASS || 0;
  const failCount = carrierStatusCounts.FAIL || 0;
  const reviewCount = carrierStatusCounts.NEEDS_REVIEW || 0;
  const unknownCount = carrierStatusCounts.UNKNOWN || 0;

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Control Tower"
        description="Live view of load volume, carrier vetting status, and recent activity."
      />

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total loads" value={totalLoads} tone="brand" />
        <MetricCard
          title="Posted"
          value={postedCount}
          delta={`${assignedCount} assigned`}
          tone="neutral"
        />
        <MetricCard
          title="In transit"
          value={inTransitCount}
          delta={`${deliveredCount} delivered`}
          tone="brand"
        />
        <MetricCard title="Total carriers" value={totalCarriers} tone="neutral" />
        <MetricCard title="Vetted PASS" value={passCount} tone="pass" />
        <MetricCard title="Vetted FAIL" value={failCount} tone="fail" />
        <MetricCard title="Needs review" value={reviewCount} tone="review" />
        <MetricCard title="Unknown" value={unknownCount} tone="unknown" />
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel>
          <PanelHeader
            title="Recent loads"
            description={`${recentLoads.length} of ${totalLoads} most recently created`}
            action={
              <Link
                href="/dashboard/loads"
                className="inline-flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-[11px] font-medium text-mist-300 transition-colors hover:bg-ink-700"
              >
                View all loads
              </Link>
            }
          />
          <Suspense fallback={<TableSkeleton rows={3} columns={6} />}>
            <RecentLoadsTable loads={recentLoads} />
          </Suspense>
        </Panel>

        <Panel>
          <PanelHeader
            title="Recent carriers"
            description={`${recentCarriers.length} of ${totalCarriers} by legal name`}
            action={
              <Link
                href="/dashboard/carriers"
                className="inline-flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-[11px] font-medium text-mist-300 transition-colors hover:bg-ink-700"
              >
                View all carriers
              </Link>
            }
          />
          <Suspense fallback={<TableSkeleton rows={3} columns={5} />}>
            <RecentCarriersTable carriers={recentCarriers} />
          </Suspense>
        </Panel>
      </div>
    </div>
  );
}
