/**
 * BFF route: accept / assign a carrier to a POSTED load.
 *
 * Forwards carrierId + actorRole to the backend and attaches the session
 * token server-side so the browser never sees it.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api";

export async function POST(request, { params }) {
  const { id } = params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const token = await cookies().then((store) => store.get("fbc_session")?.value);

  try {
    const result = await apiFetch(`/api/loads/${encodeURIComponent(id)}/assign`, {
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
      { success: false, error: "Unexpected error while assigning carrier." },
      { status: 500 }
    );
  }
}
