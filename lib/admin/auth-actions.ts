"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { CAPTCHA_SESSION_COOKIE, verifyCaptchaAnswer } from "@/lib/captcha/captcha";
import { getClientIp, hashClientIp } from "@/lib/comments/comment-security";
import { endSession, startSession } from "@/lib/auth/auth";
import type { LoginState } from "@/lib/admin/types";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/session";

export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const captchaAnswer = String(formData.get("captchaAnswer") ?? "").trim();

  const ip = getClientIp(await headers());
  const ipHash = ip ? hashClientIp(ip) : null;
  const sessionToken = (await cookies()).get(CAPTCHA_SESSION_COOKIE)?.value ?? null;

  const captchaResult = await verifyCaptchaAnswer({ sessionToken, answer: captchaAnswer, ipHash });
  if (captchaResult !== "ok") {
    return { error: captchaResult === "wrong" ? "captcha_wrong" : "captcha_expired" };
  }

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
