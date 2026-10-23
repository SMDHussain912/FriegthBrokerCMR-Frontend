/**
 * BFF route: list loads.
 *
 * The backend exposes `GET /api/loads` publicly in demo mode, but the browser
 * must never talk to the backend directly — the BFF is the only client-facing
 * surface. Without this route, a client-side load refresh returned 405 because
 * only `POST` was exported on this path (see docs/PRODUCT_ROADMAP.md, finding
 * 2.2).
 *
 * The session token is still attached when one is present: it is harmless for
 * a public endpoint and lets the route keep working unchanged if the backend
 * later requires authentication for load lists.
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
  const status = search.get("status");
  const equipmentType = search.get("equipmentType");
  if (status) params.set("status", status);
  if (equipmentType) params.set("equipmentType", equipmentType);

  const suffix = params.toString() ? `?${params.toString()}` : "";

  try {
    const result = await apiFetch(`/api/loads${suffix}`, { token });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error while listing loads." },
      { status: 500 }
    );
  }
}

/**
 * BFF route: create a new load.
 *
 * Forwards load data to the backend and attaches the session token
 * server-side so the browser never sees it.
 */

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const token = await getSessionToken();

  try {
    const result = await apiFetch("/api/loads", {
      token,
      init: {
        method: "POST",
        body: JSON.stringify(body),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error while creating load." },
      { status: 500 }
    );
  }
}
