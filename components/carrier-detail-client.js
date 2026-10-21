"use client";

import Link from "next/link";
import { Panel, PanelHeader, StatusBadge, Chip, DataPoint } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/format";

export function CarrierDetailClient({ carrier, vetting }) {

  return (
    <div className="space-y-6">
      <PanelHeader
        title={carrier.legalName}
        description={carrier.dbaName ? `DBA ${carrier.dbaName}` : "Carrier dossier"}
        action={
          <Link
            href="/dashboard/carriers"
            className="inline-flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-[11px] font-medium text-mist-300 transition-colors hover:bg-ink-700"
          >
            Back to carriers
          </Link>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 py-4">
          <div className="col-span-1 md:col-span-2">
            <DataPoint label="DOT number" value={carrier.dotNumber} mono />
            <DataPoint label="MC/FF number" value={carrier.mcNumber} mono />
            <DataPoint label="Authority status" value={carrier.authorityStatus} />
            <DataPoint label="Safety rating" value={carrier.safetyRating} />
            <DataPoint label="Authority grant date" value={formatDate(carrier.authorityGrantDate)} />
          </div>
          <div className="col-span-1 md:col-span-1">
            <DataPoint label="Overall vetting" value={carrier.overallStatus} mono />
            <DataPoint label="Demo data" value={carrier.isDemoData ? "Yes" : "No"} />
          </div>
        </div>

        {carrier.contact && (
          <div className="border-t border-ink-700 pt-4 px-5">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500 mb-3">Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DataPoint label="Phone" value={carrier.contact.phone || "—"} />
              <DataPoint label="Email" value={carrier.contact.email || "—"} />
              <DataPoint label="Address" value={carrier.contact.address ? `${carrier.contact.address.street}, ${carrier.contact.address.city}, ${carrier.contact.address.state} ${carrier.contact.address.zip}` : "—"} />
            </div>
          </div>
        )}
      </Panel>

      {/* FMCSA metrics */}
      <Panel>
        <PanelHeader title="FMCSA safety metrics" description="Safety and compliance percentiles from the FMCSA SAFER system (demo data)." />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-5 py-4">
          <DataPoint label="Unsafe driving" value={`${carrier.fmcsaMetrics?.unsafeDrivingPercentile ?? 0}%`} mono />
          <DataPoint label="HOS compliance" value={`${carrier.fmcsaMetrics?.hosCompliancePercentile ?? 0}%`} mono />
          <DataPoint label="Vehicle maintenance" value={`${carrier.fmcsaMetrics?.vehicleMaintPercentile ?? 0}%`} mono />
          <DataPoint label="Crash total" value={carrier.fmcsaMetrics?.crashTotal ?? 0} />
          <DataPoint label="Last FMCSA check" value={formatDate(carrier.fmcsaMetrics?.lastFmcsaCheck)} />
        </div>
      </Panel>

      {/* Insurance policies */}
      <Panel>
        <PanelHeader title="Insurance policies" description="Coverage limits and verification status for each policy." />
        <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-850/50">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-ink-800">
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Provider</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Policy #</th>
                <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Limit</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Effective</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Expiration</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.1em] text-mist-500">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {(carrier.insurancePolicies || []).map((policy, idx) => (
                <tr key={idx} className="hover:bg-ink-800/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-mist-200">{policy.policyType}</td>
                  <td className="px-4 py-3 text-xs text-mist-300">{policy.insuranceProvider}</td>
                  <td className="px-4 py-3 text-xs font-mono text-mist-200">{policy.policyNumber}</td>
                  <td className="px-4 py-3 text-right text-xs font-mono tabular-nums text-mist-200">{formatCurrency(policy.coverageLimit)}</td>
                  <td className="px-4 py-3 text-xs text-mist-300">{formatDate(policy.effectiveDate)}</td>
                  <td className="px-4 py-3 text-xs text-mist-300">{formatDate(policy.expirationDate)}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                      policy.verificationStatus === 'VERIFIED' ? 'bg-pass-950 text-pass-400 ring-pass-500/30' :
                      policy.verificationStatus === 'REJECTED' ? 'bg-fail-950 text-fail-400 ring-fail-500/30' :
                      policy.verificationStatus === 'EXPIRED' ? 'bg-unknown-950 text-unknown-400 ring-unknown-500/30' :
                      'bg-ink-800 text-mist-300 ring-ink-600'
                    }`}>
                      {policy.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {(carrier.insurancePolicies || []).length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-xs text-mist-500">No insurance policies on file.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Global vetting evaluation */}
      <Panel>
        <PanelHeader title="Global account-level vetting" description="Evaluation against the brokerage baseline (dry van, $100k cargo, $1M auto liability)." />
        {error ? (
          <div className="px-5 py-3 rounded-lg border border-fail-500/30 bg-fail-950/60 text-xs text-fail-400">{error}</div>
        ) : null}
        {evaluating && !vetting ? (
          <div className="px-5 py-8 text-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink-600 border-t-brand-400" />
          </div>
        ) : null}
        {vetting && (
          <div className="px-5 py-4 border-t border-ink-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-mist-100">Vetting result</h3>
              <StatusBadge status={vetting.overallStatus} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <DataPoint label="Rule version" value={vetting.ruleVersion} mono />
              <DataPoint label="Checks passed" value={vetting.summary.passedChecks} />
              <DataPoint label="Checks failed" value={vetting.summary.failedChecks} />
              <DataPoint label="Needs review" value={vetting.summary.reviewChecks} />
              <DataPoint label="Unknown" value={vetting.summary.unknownChecks} />
            </div>
            <div className="mt-3 space-y-2">
              {vetting.checks.map((check) => (
                <div key={check.ruleKey} className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg border border-ink-800 bg-ink-850/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-mist-200">{check.ruleName}</p>
                    <p className="text-[10px] text-mist-500">{check.reasonCode}</p>
                  </div>
                  <StatusBadge status={check.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!vetting && !error && !evaluating && (
          <div className="px-5 py-8 text-center">
            <p className="text-xs text-mist-500">No vetting evaluation available.</p>
          </div>
        )}
      </Panel>
    </div>
  );
}
