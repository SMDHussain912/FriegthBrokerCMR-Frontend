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

export async function listLoads({ status, equipmentType } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (equipmentType) params.set("equipmentType", equipmentType);
  const query = params.toString();
  const body = await apiFetch(`/api/loads${query ? `?${query}` : ""}`);
  return body?.loads ?? [];
}

export async function getLoad(loadId) {
  const body = await apiFetch(`/api/loads/${encodeURIComponent(loadId)}`);
  return body?.load ?? null;
}

export async function listCarriers({ query, status } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (status) params.set("status", status);
  const search = params.toString();
  const body = await apiFetch(`/api/carriers${search ? `?${search}` : ""}`);
  return body?.carriers ?? [];
}

/** Load-specific eligibility — the differentiator. */
export async function getLoadEligibility(loadId, carrierId) {
  const body = await apiFetch(
    `/api/loads/${encodeURIComponent(loadId)}/eligibility/${encodeURIComponent(carrierId)}`
  );
  return body;
}
