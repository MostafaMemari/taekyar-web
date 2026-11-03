import { verifyPassword } from "@/lib/session";
import { prisma } from "@/server/config/prisma";
import { incrementWindowCounter } from "@/server/repositories/rate-limit.repository";
import { verifyCaptchaAnswer } from "@/server/services/captcha.service";

import type { LoginResult } from "@/types/api";

const LOGIN_WINDOW_SECONDS = 10 * 60;
const MAX_LOGIN_ATTEMPTS_PER_WINDOW = 10;
const LOGIN_RATE_KEY = "login:attempt:";

export async function loginAdmin(params: {
  username: string;
  password: string;
  captchaAnswer: string;
  captchaSessionToken: string | null;
  ipHash: string | null;
}): Promise<LoginResult> {
  if (params.ipHash) {
    const attempts = await incrementWindowCounter(
      LOGIN_RATE_KEY + params.ipHash,
      LOGIN_WINDOW_SECONDS,
    );
    if (attempts > MAX_LOGIN_ATTEMPTS_PER_WINDOW) {
      return { ok: false, error: "rate_limited" };
    }
  }

  const captchaResult = await verifyCaptchaAnswer({
    sessionToken: params.captchaSessionToken,
    answer: params.captchaAnswer,
    ipHash: params.ipHash,
  });
  if (captchaResult !== "ok") {
    return { ok: false, error: captchaResult === "wrong" ? "captcha_wrong" : "captcha_expired" };
  }

  const username = params.username.trim();
  if (!username || !params.password) return { ok: false, error: "invalid" };

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !verifyPassword(params.password, admin.passwordHash)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true };
}
