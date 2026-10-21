/**
 * BFF route: sign in.
 *
 * Exchanges credentials for a backend JWT and stores it in an httpOnly cookie.
 * The browser never sees the token, so it cannot be exfiltrated by script.
 */

import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api";
import { setSessionToken } from "@/lib/session";

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

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are both required." },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch("/api/auth/login", {
      init: {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    });

    await setSessionToken(result.token);

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error while signing in." },
      { status: 500 }
    );
  }
}
