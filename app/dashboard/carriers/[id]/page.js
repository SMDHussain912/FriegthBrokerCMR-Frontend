/**
 * Carrier detail page shell — fetches carrier data server-side, then renders
 * the client-side detail view with global vetting evaluation.
 */

import { getCarrier, getCarrierVetting } from "@/lib/data.server";
import { ErrorState } from "@/components/states";
import { Panel, PanelHeader } from "@/components/ui";
import { CarrierDetailClient } from "@/components/carrier-detail-client";

export default async function CarrierDetailPage({ params }) {
  const { id } = await params;

  let carrier;
  let vetting;
  try {
    carrier = await getCarrier(id);
  } catch {
    return (
      <Panel>
        <PanelHeader title="Carrier not found" />
        <ErrorState
          title="Carrier not found"
          description={`No carrier with ID ${id} exists in the brokerage.`}
        />
      </Panel>
    );
  }

  if (!carrier) {
    return (
      <Panel>
        <PanelHeader title="Carrier not found" />
        <ErrorState
          title="Carrier not found"
          description={`No carrier with ID ${id} exists in the brokerage.`}
        />
      </Panel>
    );
  }

  try {
    vetting = await getCarrierVetting(id);
  } catch {
    vetting = null;
  }

  return <CarrierDetailClient carrier={carrier} vetting={vetting} />;
}
