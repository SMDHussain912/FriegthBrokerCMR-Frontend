"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/dashboard/loads", label: "Loads", icon: "↦" },
  { href: "/dashboard/loads/create", label: "Create Load", icon: "▧" },
  { href: "/dashboard/carriers", label: "Carriers", icon: "⌂" },
];

/**
 * Resolves whether a nav item is the active one for a pathname.
 *
 * Exact match for the index route, prefix match for nested routes so
 * /dashboard/carriers/[id] keeps "Carriers" highlighted.
 */
function isActiveItem(item, pathname) {
  return item.href === "/dashboard"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Operations rail navigation.
 *
 * The active item is resolved with `usePathname()` rather than
 * `window.location.pathname`: the dashboard layout is a Server Component, so
 * `window` is undefined during server rendering and the active state could
 * never be painted on the first response.
 */
export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Console sections">
      {NAV.map((item) => {
        const isActive = isActiveItem(item, pathname);

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-brand-500/10 text-brand-300 ring-1 ring-inset ring-brand-500/20"
                : "text-mist-400 hover:bg-ink-800 hover:text-mist-100"
            }`}
          >
            <span
              className={isActive ? "text-brand-400" : "text-mist-500"}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            {item.label}

          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Compact navigation for phone widths.
 *
 * The 256px operations rail cannot coexist with usable content on a 390px
 * viewport — it consumed roughly two thirds of the width and squeezed the
 * main stage down to about 130px. On phones the rail is replaced by this
 * horizontally scrollable row, which keeps the same destinations reachable
 * without stealing content width.
 *
 * The desktop rail is unaffected: the layout hides this component from `md`
 * upwards and hides `DashboardNav` below `md`.
 */
export function DashboardNavCompact() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Console sections (compact)"
      className="md:hidden flex gap-1 overflow-x-auto border-b border-ink-700 bg-ink-900 px-2 py-2 shrink-0"
    >
      {NAV.map((item) => {
        const isActive = isActiveItem(item, pathname);

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
              isActive
                ? "bg-brand-500/10 text-brand-300 ring-1 ring-inset ring-brand-500/20"
                : "text-mist-400 hover:bg-ink-800 hover:text-mist-100"
            }`}
          >
            <span
              className={isActive ? "text-brand-400" : "text-mist-500"}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
