
import { apiFetch, ApiError } from "./api";

function apiFetchWithToken(path, options = {}) {
  const { token } = options;
  return apiFetch(path, options);
}

export async function listCompanies() {
  const body = await apiFetch("/api/companies");
  return body?.companies ?? [];
}

export async function getCompany(id) {
  const body = await apiFetch("/api/companies/".concat(id));
  return body?.company ?? null;
}

export async function listUserCompanies(options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken("/api/companies", options);
  return body?.companies ?? [];
}

export async function getCompanyDetails(id, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken("/api/companies/".concat(encodeURIComponent(id)), options);
  return body?.company ?? null;
}

export async function createCompany(companyData, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken("/api/companies", {
    method: "POST",
    body: JSON.stringify(companyData),
    token
  });
  return body;
}

export async function updateCompany(id, updateData, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken(
    "/api/companies/".concat(encodeURIComponent(id)), {
    method: "PATCH",
    body: JSON.stringify(updateData),
    token
  });
  return body;
}

export async function listCompanyMembers(companyId, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken(
    "/api/companies/".concat(encodeURIComponent(companyId)).concat("/members"),
    options
  );
  return body?.members ?? [];
}

export async function addCompanyMember(companyId, userId, role, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken(
    "/api/companies/".concat(encodeURIComponent(companyId)).concat("/members"), {
      method: "POST",
      body: JSON.stringify({ userId, role }),
      token
    });
  return body;
}

export async function updateCompanyMember(companyId, membershipId, role, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken(
    "/api/companies/".concat(encodeURIComponent(companyId)).concat("/members/".concat(encodeURIComponent(membershipId))), {
      method: "PATCH",
      body: JSON.stringify({ role }),
      token
    });
  return body;
}

export async function removeCompanyMember(companyId, membershipId, options = {}) {
  const { token } = options;
  const body = await apiFetchWithToken(
    "/api/companies/".concat(encodeURIComponent(companyId)).concat("/members/".concat(encodeURIComponent(membershipId))), {
      method: "DELETE",
      token
    });
  return body;
}

/**
 * Evaluate a carrier against a specific load through the same-origin BFF.
 * The browser never calls the Express API directly.
 */
export async function getLoadEligibility(loadId, carrierId) {
  const response = await fetch(
    `/api/loads/${encodeURIComponent(loadId)}/eligibility/${encodeURIComponent(carrierId)}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error || `Eligibility request failed with status ${response.status}`);
  }

  return body?.evaluation ?? null;
}

/** List loads through the backend API. Requires a session token. */
export async function listLoads(filters = {}, options = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.equipmentType) params.set("equipmentType", filters.equipmentType);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  const body = await apiFetchWithToken(`/api/loads${suffix}`, options);
  return body?.loads ?? [];
}

/** List carriers through the backend API; demo mode allows public listing. */
export async function listCarriers(filters = {}, options = {}) {
  const params = new URLSearchParams();
  if (filters.query) params.set("query", filters.query);
  if (filters.status) params.set("status", filters.status);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  const body = await apiFetchWithToken(`/api/carriers${suffix}`, options);
  return body?.carriers ?? [];
}
