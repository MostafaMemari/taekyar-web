import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/session";

export async function startSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
