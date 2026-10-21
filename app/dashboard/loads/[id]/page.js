/**
 * Load detail page shell — fetches load data server-side, then renders
 * the client-side detail view with eligibility evaluation.
 */

import { getLoad } from "@/lib/data";
import { ErrorState } from "@/components/states";
import { Panel, PanelHeader } from "@/components/ui";
import { LoadDetailClient } from "@/components/load-detail-client";

export default async function LoadDetailPage({ params }) {
  const { id } = await params;

  let load;
  try {
    load = await getLoad(id);
  } catch {
    return (
      <Panel>
        <PanelHeader title="Load not found" />
        <ErrorState
          title="Load not found"
          description={`No load with ID ${id} exists in the brokerage.`}
        />
      </Panel>
    );
  }

  if (!load) {
    return (
      <Panel>
        <PanelHeader title="Load not found" />
        <ErrorState
          title="Load not found"
          description={`No load with ID ${id} exists in the brokerage.`}
        />
      </Panel>
    );
  }

  return <LoadDetailClient load={load} />;
}
