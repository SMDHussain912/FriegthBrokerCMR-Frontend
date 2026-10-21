/**
 * BFF route: register a new account.
 *
 * Forwards name, email, password and role to the backend, then stores the
 * returned JWT in an httpOnly session cookie so the browser never sees it.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api";

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

  try {
    const result = await apiFetch("/api/auth/register", {
      init: {
        method: "POST",
        body: JSON.stringify(body),
      },
    });

    if (result.token) {
      const store = await cookies();
      store.set("fbc_session", result.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error while creating account." },
      { status: 500 }
    );
  }
}
