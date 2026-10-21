"use client";

import { useState } from "react";
import Link from "next/link";
import { Panel, PanelHeader, StatusBadge, Chip, DataPoint } from "@/components/ui";
import { formatCurrency, formatDate, formatEquipment, formatLoadStatus } from "@/lib/format";
import { getLoadEligibility } from "@/lib/data";
import { EvidenceDrawer } from "./evidence-drawer";

export function LoadDetailClient({ load }) {
  const [eligibility, setEligibility] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [evidenceCheck, setEvidenceCheck] = useState(null);

  async function evaluateCarrier(carrierId) {
    setEvaluating(true);
    setError(null);
    setEligibility(null);
    try {
      const result = await getLoadEligibility(load._id, carrierId);
      setEligibility(result);
    } catch (err) {
      setError(err?.message || "Eligibility evaluation failed.");
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        title={load.loadNumber}
        description={
          <>
            {formatLoadStatus(load.status)} load ·{" "}
            {formatRoute(load.origin, load.destination)}
          </>
        }
        action={
          <Link
            href="/dashboard/loads"
            className="inline-flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-[11px] font-medium text-mist-300 transition-colors hover:bg-ink-700"
          >
            Back to loads
          </Link>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 py-4">
          <div className="col-span-1 md:col-span-2">
            <DataPoint label="Shipper" value={load.shipperName} />
            <DataPoint label="Commodity" value={load.commodity} />
            <DataPoint label="Pickup" value={formatDate(load.origin?.pickupDate)} />
            <DataPoint label="Delivery" value={formatDate(load.destination?.deliveryDate)} />
          </div>
          <div className="col-span-1 md:col-span-1">
            <DataPoint label="Equipment" value={formatEquipment(load.equipmentType)} mono />
            <DataPoint label="Declared value" value={formatCurrency(load.declaredCargoValue)} mono />
            <DataPoint label="Status" value={formatLoadStatus(load.status)} mono />
          </div>
        </div>
        {load.assignedCarrier ? (
          <div className="border-t border-ink-700 pt-4 px-5">
            <DataPoint label="Assigned carrier" value={load.assignedCarrier.legalName} />
            <DataPoint label="DOT / MC" value={`${load.assignedCarrier.dotNumber} / ${load.assignedCarrier.mcNumber}`} />
          </div>
        ) : null}
      </Panel>

      <LoadEligibilityPanel
        load={load}
        eligibility={eligibility}
        evaluating={evaluating}
        error={error}
        onEvaluate={evaluateCarrier}
        onShowEvidence={setEvidenceCheck}
      />

      {evidenceCheck && (
        <EvidenceDrawer check={evidenceCheck} onClose={() => setEvidenceCheck(null)} />
      )}
    </div>
  );
}

function formatRoute(origin, destination) {
  const from = origin?.city && origin?.state ? `${origin.city}, ${origin.state}` : null;
  const to = destination?.city && destination?.state ? `${destination.city}, ${destination.state}` : null;
  if (from && to) return `${from} → ${to}`;
  return from || to || "—";
}

function LoadEligibilityPanel({
  load,
  eligibility,
  evaluating,
  error,
  onEvaluate,
  onShowEvidence,
}) {
  return (
    <Panel>
      <PanelHeader
        title="Load-specific carrier eligibility"
        description="Evaluate any carrier against this load's requirements. Results are itemized in the evidence drawer below."
      >
        <div className="ml-auto flex flex-wrap gap-2">
          <input
            id="carrier-select"
            className="rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-xs text-mist-100 focus:border-brand-500 focus:outline-none"
            placeholder="Carrier ID"
            autoComplete="off"
          />
          <button
            onClick={() => {
              const input = document.getElementById("carrier-select");
              const id = input?.value.trim();
              if (id) onEvaluate(id);
            }}
            disabled={evaluating}
            className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
          >
            {evaluating ? "Evaluating…" : "Evaluate"}
          </button>
        </div>
      </PanelHeader>

      {error ? (
        <div className="px-5 py-3 rounded-lg border border-fail-500/30 bg-fail-950/60 text-xs text-fail-400">
          {error}
        </div>
      ) : null}

      {eligibility ? (
        <div className="px-5 py-4 border-t border-ink-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-mist-100">
              Eligibility result
            </h3>
            <StatusBadge status={eligibility.overallStatus} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <DataPoint label="Rule version" value={eligibility.ruleVersion} mono />
            <DataPoint label="Checks passed" value={eligibility.summary.passedChecks} />
            <DataPoint label="Checks failed" value={eligibility.summary.failedChecks} />
            <DataPoint label="Needs review" value={eligibility.summary.reviewChecks} />
          </div>
          <div className="mt-3 space-y-2">
            {eligibility.checks.map((check) => (
              <div
                key={check.ruleKey}
                className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg border border-ink-800 bg-ink-850/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-mist-200">{check.ruleName}</p>
                  <p className="text-[10px] text-mist-500">{check.reasonCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={check.status} size="sm" />
                  <button
                    onClick={() => onShowEvidence(check)}
                    className="rounded-md p-1.5 text-mist-500 hover:text-brand-400 transition-colors"
                    aria-label="Show evidence"
                  >
                    ◈
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!eligibility && !error && !evaluating ? (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-mist-500">
            Enter a carrier ID above to evaluate load-specific eligibility.
          </p>
        </div>
      ) : null}
    </Panel>
  );
}
