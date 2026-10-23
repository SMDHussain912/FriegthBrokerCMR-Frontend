/**
 * BFF route: current session.
 *
 * Returns the identity behind the session cookie so the client can tell who is
 * signed in without the browser ever seeing the token itself. The backend
 * `GET /api/auth/me` route requires authentication, so a missing or expired
 * session is reported as 401 rather than silently returning an empty user.
 *
 * See docs/PRODUCT_ROADMAP.md, finding 2.2.
 */

import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Not signed in." },
      { status: 401 }
    );
  }

  try {
    const result = await apiFetch("/api/auth/me", { token });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error while reading the session." },
      { status: 500 }
    );
  }
}
