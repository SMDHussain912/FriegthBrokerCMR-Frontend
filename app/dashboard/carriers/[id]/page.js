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

  // Vetting evaluation is a separate, independently-failing call. A carrier
  // dossier must still render when the evaluation endpoint is unavailable —
  // the missing evaluation is reported in-panel rather than blanking the page.
  let vetting = null;
  let vettingError = null;
  try {
    vetting = await getCarrierVetting(id);
  } catch (error) {
    vettingError =
      error?.message ||
      "Vetting evaluation could not be loaded. The carrier dossier below is still current.";
  }

  return (
    <CarrierDetailClient
      carrier={carrier}
      vetting={vetting}
      vettingError={vettingError}
    />
  );
}
