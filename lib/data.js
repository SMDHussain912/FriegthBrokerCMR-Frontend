/**
 * Data access layer — public reads only.
 *
 * These functions do not require authentication and are safe to use in both
 * Server Components and Client Components. Authenticated reads live in
 * `data.server.js` because they import `next/headers`.
 *
 * Note on caching: `cacheComponents` is enabled, but this data is
 * compliance-relevant and changes whenever a broker verifies a policy, so it
 * is read at request time (`no-store`) rather than cached. The response is
 * still streamed into the static shell behind a Suspense boundary.
 */

import { apiFetch, ApiError } from "./api";

/**
 * Helper that attaches the session token if available.
 * Server Components can pass `token` from getSessionToken();
 * Client Components should omit the token for public reads.
 *
 * When token is provided, the backend will authenticate the user.
 * When token is omitted, the backend may return 401 on protected routes,
 * which calling code should handle gracefully.
 */

function apiFetchWithToken(path, options = {}) {
  const { token } = options;
  return apiFetch(path, options);
}

export async function listLoads({ status, equipmentType } = {}, options = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (equipmentType) params.set("equipmentType", equipmentType);
  const query = params.toString();
  const body = await apiFetchWithToken(`/api/loads${query ? `?${query}` : ""}`, options);
  return body?.loads ?? [];
}

export async function getLoad(loadId, options = {}) {
  const body = await apiFetchWithToken(`/api/loads/${encodeURIComponent(loadId)}`, options);
  return body?.load ?? null;
}

export async function listCarriers({ query, status } = {}, options = {}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (status) params.set("status", status);
  const search = params.toString();
  const body = await apiFetchWithToken(`/api/carriers${search ? `?${search}` : ""}`, options);
  return body?.carriers ?? [];
}

/** Load-specific eligibility — the differentiator. */
export async function getLoadEligibility(loadId, carrierId, options = {}) {
  const body = await apiFetchWithToken(
    `/api/loads/${encodeURIComponent(loadId)}/eligibility/${encodeURIComponent(carrierId)}`,
    options
  );
  return body;
}
