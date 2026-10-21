"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EQUIPMENT_TYPES = ["DRY_VAN", "REEFER", "FLATBED"];

export default function CreateLoadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    loadNumber: "",
    shipperName: "",
    originCity: "",
    originState: "",
    originPickupDate: "",
    destinationCity: "",
    destinationState: "",
    destinationDeliveryDate: "",
    commodity: "",
    equipmentType: "DRY_VAN",
    targetTemperature: "",
    declaredCargoValue: "",
    minAuthorityAgeDays: "90",
    minAutoLiability: "1000000",
    requireReeferEndorsement: "false",
    disallowConditionalSafety: "true",
    maxUnsafeDrivingPercentile: "75",
  });
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(null);

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const loadData = {
      loadNumber: form.loadNumber.trim(),
      shipperName: form.shipperName.trim(),
      origin: {
        city: form.originCity.trim(),
        state: form.originState.trim(),
        pickupDate: form.originPickupDate || null,
      },
      destination: {
        city: form.destinationCity.trim(),
        state: form.destinationState.trim(),
        deliveryDate: form.destinationDeliveryDate || null,
      },
      commodity: form.commodity.trim(),
      equipmentType: form.equipmentType,
      targetTemperature:
        form.equipmentType === "REEFER" && form.targetTemperature
          ? Number(form.targetTemperature)
          : undefined,
      declaredCargoValue: Number(form.declaredCargoValue),
      loadRequirements: {
        minAuthorityAgeDays: Number(form.minAuthorityAgeDays),
        minAutoLiability: Number(form.minAutoLiability),
        requireReeferEndorsement: form.requireReeferEndorsement === "true",
        disallowConditionalSafety: form.disallowConditionalSafety === "true",
        maxUnsafeDrivingPercentile: Number(form.maxUnsafeDrivingPercentile),
      },
    };

    try {
      const response = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loadData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Failed to create load.");
        setPending(false);
        return;
      }

      setCreated(result?.load ?? null);
    } catch (err) {
      setError(err?.message || "Failed to create load.");
      setPending(false);
    }
  }

  if (created) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-pass-500/30 bg-pass-950/40 px-5 py-4">
          <h2 className="text-sm font-semibold text-pass-400">Load created</h2>
          <p className="mt-1 text-xs text-mist-300">
            {created.loadNumber} - {created.origin.city}, {created.origin.state} to {created.destination.city}, {created.destination.state}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={"/dashboard/loads/" + created._id}
            className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
          >
            View load
          </Link>
          <Link
            href="/dashboard/loads"
            className="rounded-lg border border-ink-700 bg-ink-850 px-4 py-2.5 text-sm font-semibold text-mist-300 hover:bg-ink-700"
          >
            Back to loads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-mist-50">Create Load</h1>
        <p className="mt-1 text-xs text-mist-500 uppercase tracking-[0.08em]">Post a new load to the brokerage</p>
      </div>

      <div className="rounded-panel border border-ink-700 bg-ink-900/80 p-6 shadow-2xl backdrop-blur-sm">
        {error ? (
          <div role="alert" className="rounded-lg border border-fail-500/30 bg-fail-950/60 px-3 py-2.5 text-xs text-fail-400 mb-4">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="loadNumber" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Load number</label>
              <input id="loadNumber" required value={form.loadNumber} onChange={(e) => update("loadNumber", e.target.value)} placeholder="LD-2026-0001" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="shipperName" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Shipper</label>
              <input id="shipperName" required value={form.shipperName} onChange={(e) => update("shipperName", e.target.value)} placeholder="Acme Manufacturing" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="originCity" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Origin city</label>
              <input id="originCity" required value={form.originCity} onChange={(e) => update("originCity", e.target.value)} placeholder="Dallas" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="originState" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Origin state</label>
              <input id="originState" required value={form.originState} onChange={(e) => update("originState", e.target.value)} placeholder="TX" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="destinationCity" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Destination city</label>
              <input id="destinationCity" required value={form.destinationCity} onChange={(e) => update("destinationCity", e.target.value)} placeholder="Atlanta" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="destinationState" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Destination state</label>
              <input id="destinationState" required value={form.destinationState} onChange={(e) => update("destinationState", e.target.value)} placeholder="GA" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="commodity" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Commodity</label>
              <input id="commodity" required value={form.commodity} onChange={(e) => update("commodity", e.target.value)} placeholder="Electronics" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="equipmentType" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Equipment type</label>
              <select id="equipmentType" value={form.equipmentType} onChange={(e) => update("equipmentType", e.target.value)} className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none">
                {EQUIPMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>

          {form.equipmentType === "REEFER" && (
            <div>
              <label htmlFor="targetTemperature" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Target temperature (F)</label>
              <input id="targetTemperature" type="number" value={form.targetTemperature} onChange={(e) => update("targetTemperature", e.target.value)} placeholder="38" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="declaredCargoValue" className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400">Declared cargo value ($)</label>
              <input id="declaredCargoValue" type="number" required value={form.declaredCargoValue} onChange={(e) => update("declaredCargoValue", e.target.value)} placeholder="100000" className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Posting load..." : "Post load"}
          </button>
        </form>
      </div>

      <div className="mt-4">
        <Link href="/dashboard/loads" className="text-mist-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-mist-200">
          Back to loads
        </Link>
      </div>
    </div>
  );
}
