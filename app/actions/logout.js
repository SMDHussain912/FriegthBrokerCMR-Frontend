/**
 * Server action: sign out the current user.
 *
 * Calls the BFF logout route to clear the httpOnly session cookie,
 * then returns a redirect URL for the client.
 */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearSessionToken } from "@/lib/session";

export async function logoutAction() {
  await clearSessionToken();
  redirect("/");
}
