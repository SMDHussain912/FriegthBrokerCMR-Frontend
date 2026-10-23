/**
 * Authenticated console shell.
 *
 * Wraps every /dashboard/* route with a dark ops-console layout:
 * a persistent sidebar for navigation and a header with the current
 * user and logout action. The layout reads the session server-side
 * so the user identity is never exposed to client JavaScript.
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data.server";
import { logoutAction } from "@/app/actions/logout";
import { DashboardNav, DashboardNavCompact } from "@/components/dashboard-nav";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen flex-col bg-ink-950 text-mist-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-ink-700 bg-ink-900/80 px-6 py-3 shrink-0 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-sm font-semibold text-brand-300">
            FB
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-mist-50">
              FreightBrokerCMR
            </h1>
            <p className="text-[10px] tracking-wider text-mist-500 uppercase">
              Carrier vetting control tower
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-ink-700 bg-ink-850/50 text-xs text-mist-300">
            <span className="font-medium text-mist-100">{user.name}</span>
            <span className="text-mist-500">·</span>
            <span>{user.role}</span>
          </div>
          <form action={logoutAction} className="ml-2">
            <button
              type="submit"
              className="rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-mist-300 transition-colors hover:bg-ink-700 hover:text-mist-100 disabled:opacity-60"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/*
          Compact navigation for phone widths.

          The 256px operations rail is a fixed desktop presentation (see
          docs/DESIGN.md), but at a 390px viewport it consumed roughly two
          thirds of the width and left the main stage about 130px wide, so
          every table scrolled sideways. Below `md` the rail is replaced by a
          horizontally scrollable row and the main stage takes the full width.
        */}
        <DashboardNavCompact />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — desktop only */}
          <aside
            className="hidden md:flex w-64 flex-col border-r border-ink-700 bg-ink-900 shrink-0"
          >
            <DashboardNav />

            <div className="px-3 py-4 border-t border-ink-700 mt-auto">
              <p className="text-[10px] uppercase tracking-[0.1em] text-mist-500">
                Demo environment
              </p>
              <p className="text-xs text-mist-500">
                All carrier evidence is labelled demo data.
              </p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-ink-950 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
