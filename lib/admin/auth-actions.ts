"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "@/lib/auth";
import type { LoginState } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/session";

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) return {};

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "invalid" };
  }

  await startSession(username);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}
