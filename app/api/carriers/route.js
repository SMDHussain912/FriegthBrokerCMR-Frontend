/**
 * BFF route: list carriers.
 *
 * The backend exposes `GET /api/carriers` publicly in demo mode, but the
 * browser must never talk to the backend directly — the BFF is the only
 * client-facing surface. Without this route, a client-side carrier refresh
 * returned 404 (see docs/PRODUCT_ROADMAP.md, finding 2.2).
 *
 * The session token is still attached when one is present: it is harmless for
 * a public endpoint and lets the route keep working unchanged if the backend
 * later requires authentication for carrier lists.
 */

import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

export async function GET(request) {
  const token = await getSessionToken();

  // Forward only the filters the backend understands, so an unknown query
  // parameter cannot change the shape of the request the backend receives.
  const search = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  const query = search.get("query");
  const status = search.get("status");
  if (query) params.set("query", query);
  if (status) params.set("status", status);

  const suffix = params.toString() ? `?${params.toString()}` : "";

  try {
    const result = await apiFetch(`/api/carriers${suffix}`, { token });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error while listing carriers." },
      { status: 500 }
    );
  }
}
