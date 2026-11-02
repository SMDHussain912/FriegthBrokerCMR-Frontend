"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetchWithToken } from "@/lib/data";
import { Panel, PanelHeader } from "@/components/ui";

export function CompanyForm({ initialValues, onSubmit }) {
  const [form, setForm] = useState(initialValues || {});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" disabled={submitting}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-mist-400 mb-1">
            Company name
          </label>
          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={
              "w-full rounded-panel border border-ink-700 bg-ink-900/80 py-2.5 pl-3 text-sm text-mist-300 focus:outline-none focus:border-brand-500"
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-mist-400 mb-1">
            Type
          </label>
          <select
            value={form.type || "brokerage"}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={
              "w-full rounded-panel border border-ink-700 bg-ink-900/80 py-2.5 pl-3 text-sm text-mist-300 focus:outline-none focus:border-brand-500"
            }>
            <option value="brokerage">Brokerage</option>
            <option value="carrier">Carrier</option>
            <option value="platform">Platform</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-mist-400 mb-1">
          Slug (auto-generated if blank)
          </label>
          <input
            value={form.slug || ""}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={
              "w-full rounded-panel border border-ink-700 bg-ink-900/80 py-2.5 pl-3 text-sm text-mist-300 focus:outline-none focus:border-brand-500"
            }>
          />
          <small className="text-xs text-mist-500">
            Used in the URL: /companies/<slug>
          </small>
        </div>
      </form>
    );
  }
