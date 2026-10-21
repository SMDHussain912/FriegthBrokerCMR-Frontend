/**
 * Session helpers.
 *
 * The backend issues a stateless JWT. We keep it in an httpOnly cookie so the
 * token is never exposed to client JavaScript, and so the BFF route handlers
 * can attach it server-side without the browser ever seeing it.
 */

import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "./constants";

export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };

export async function getSessionToken() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Optimistic check used by proxy.js. It only proves a cookie exists — the real
 * authorization decision always happens server-side against the backend.
 *
 * This helper is deliberately dependency-free so `proxy.js` does not need to
 * import `next/headers`.
 */
export function hasSessionCookie(request) {
  return Boolean(request.cookies.get(SESSION_COOKIE)?.value);
}

