/**
 * Next.js 16 Proxy (formerly Middleware).
 *
 * This is an *optimistic* check only: it proves a session cookie exists before
 * we spend a server render on a protected page. The authoritative check runs
 * in the server layout / DAL, where the token is verified against the backend.
 */

import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

const PROTECTED_PREFIXES = ["/dashboard", "/loads", "/carriers"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isProtected && !hasCookie) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/" && hasCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};

