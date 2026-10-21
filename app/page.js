import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/login-form";
import { getCurrentUser } from "@/lib/data.server";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient grid + glow — the only decorative flourish in the product. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(107,164,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(107,164,255,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-600/18 blur-[120px]"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-lg font-semibold text-brand-300">
            FB
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-mist-50">
            FreightBrokerCMR
          </h1>
          <p className="mt-1.5 text-sm text-mist-400">
            Carrier vetting control tower
          </p>
        </div>

        <div className="rounded-panel border border-ink-700 bg-ink-900/80 p-6 shadow-2xl backdrop-blur-sm">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-ink-850" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-mist-500">
          Every dispatch decision is backed by itemized, versioned evidence.
          <br />
          Demo data is clearly labelled throughout.
        </p>
      </div>
    </main>
  );
}

