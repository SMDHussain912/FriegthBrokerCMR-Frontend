import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

/**
 * Same-origin BFF for load-specific carrier eligibility.
 * The backend route is public in demo mode; a session token is forwarded
 * when available so the frontend remains compatible with authenticated mode.
 */
export async function GET(_request, { params }) {
  const { loadId, carrierId } = await params;
  const token = await getSessionToken();

  try {
    const result = await apiFetch(
      `/api/loads/${encodeURIComponent(loadId)}/eligibility/${encodeURIComponent(carrierId)}`,
      { token }
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unexpected error while evaluating load eligibility." },
      { status: 500 }
    );
  }
}
