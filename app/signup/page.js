"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "broker", label: "Broker", description: "Posts loads and assigns carriers" },
  { value: "compliance_officer", label: "Compliance Officer", description: "Verifies insurance and vetting evidence" },
  { value: "admin", label: "Administrator", description: "Full platform access" },
];

export default function SignupPage() {
  const router = useRouter();
  const nextPath = "/dashboard";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "broker",
  });
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error || "Account creation failed.");
        setPending(false);
        return;
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!loginResponse.ok) {
        setError(body?.message || "Account created, but sign-in failed — please sign in manually.");
        setPending(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Network error — could not reach the sign-up service.");
      setPending(false);
    }
  }
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-lg font-semibold text-brand-300">
            FB
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-mist-50">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-mist-400">
            Join the carrier vetting control tower
          </p>
        </div>

        <div className="rounded-panel border border-ink-700 bg-ink-900/80 p-6 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Rivera"
                className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@brokerage.com"
                className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:border-brand-500 focus:outline-none"
              />
              <p className="mt-1 text-[10px] text-mist-500 uppercase tracking-[0.08em]">
                At least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-[11px] font-medium uppercase tracking-[0.08em] text-mist-400"
              >
                Who are you? (your role)
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 transition-colors focus:border-brand-500 focus:outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label} — {r.description}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-fail-500/30 bg-fail-950/60 px-3 py-2.5 text-xs text-fail-400"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating account…" : "Create account & sign in"}
            </button>
          </form>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => router.replace("/")}
              className="text-mist-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-mist-200"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-mist-500">
          Every dispatch decision is backed by itemized, versioned evidence.<br />
          Your role determines what you can see and do in the console.
        </p>
      </div>
    </main>
  );
}
