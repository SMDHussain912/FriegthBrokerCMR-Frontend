/**
 * Typed access layer for the Express backend.
 *
 * Every server component and route handler goes through `apiFetch` so that:
 *  - the backend base URL is configured in exactly one place,
 *  - the session token is attached server-side (never exposed to the browser),
 *  - backend error envelopes are normalised into a single `ApiError` shape.
 */

const API_BASE_URL = (
  process.env.BACKEND_API_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 500, code, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

/**
 * @param {string} path Backend path, e.g. "/api/loads"
 * @param {object} [options]
 * @param {string} [options.token] Bearer token
 * @param {RequestInit} [options.init]
 */
export async function apiFetch(path, { token, init = {} } = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(
      "Cannot reach the FreightBrokerCMR API. Is the backend running?",
      { status: 503, code: "BACKEND_UNREACHABLE", payload: { cause: String(error) } }
    );
  }

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  if (!response.ok) {
    throw new ApiError(body?.error || `Request failed with status ${response.status}`, {
      status: response.status,
      code: body?.code,
      payload: body,
    });
  }

  return body;
}
