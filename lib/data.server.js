/**
 * Server-only data access — authenticated reads.
 *
 * These functions attach the session token and can only be used in Server
 * Components or API routes. They import `next/headers` which is not
 * available in the browser.
 */

import { apiFetch, ApiError } from "./api";
import { getSessionToken } from "./session";

async function authFetch(path, init) {
  const token = await getSessionToken();
  return apiFetch(path, { token, init });
}

export async function getCurrentUser() {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const body = await apiFetch("/api/auth/me", { token });
    return body?.user ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function getCarrier(carrierId) {
  const body = await authFetch(`/api/carriers/${encodeURIComponent(carrierId)}`);
  return body?.carrier ?? null;
}

/** Account-level vetting evaluation against the engine's global baseline. */
export async function getCarrierVetting(carrierId) {
  const body = await authFetch(`/api/carriers/${encodeURIComponent(carrierId)}/vet`);
  return body?.evaluation ?? null;
}

/** Active (not latest-attempt) audit snapshot for a load. */
export async function getLoadAssignment(loadId) {
  const body = await authFetch(`/api/loads/${encodeURIComponent(loadId)}/assignment`);
  return body ?? null;
}
