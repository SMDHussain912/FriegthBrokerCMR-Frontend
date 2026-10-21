"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DEMO_EMAIL = "compliance.demo@ricoz.local";
const DEMO_PASSWORD = "Compliance123!";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error || "Sign in failed.");
        setPending(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Network error — could not reach the sign-in service.");
      setPending(false);
    }
  }

  function fillDemoCredentials() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••••"
          className="mt-2 w-full rounded-lg border border-ink-600 bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-500 transition-colors focus:border-brand-500 focus:outline-none"
        />
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
        {pending ? "Verifying…" : "Sign in to the console"}
      </button>

      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-mist-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-mist-200"
        >
          Use demo compliance credentials
        </button>
        <a
          href="/signup"
          className="text-mist-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-mist-200"
        >
          Create an account
        </a>
      </div>
    </form>
  );
}
