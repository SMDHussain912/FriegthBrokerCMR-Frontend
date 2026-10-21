/**
 * BFF route: sign out. Clears the session cookie.
 */

import { NextResponse } from "next/server";
import { clearSessionToken } from "@/lib/session";

export async function POST() {
  await clearSessionToken();
  return NextResponse.json({ success: true });
}
