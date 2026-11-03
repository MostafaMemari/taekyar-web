import { NextResponse, type NextRequest } from "next/server";

import {
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  createSessionToken,
} from "@/lib/session";
import { loginSchema } from "@/lib/validation/auth.schema";
import { handleApi, jsonError, jsonOk, parseJsonBody } from "@/server/http/api";
import { resolveIpHash } from "@/server/security/client";
import { assertSameOrigin } from "@/server/security/origin";
import { loginAdmin } from "@/server/services/auth.service";
import { CAPTCHA_SESSION_COOKIE } from "@/server/services/captcha.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ERROR_STATUS: Record<string, number> = {
  invalid: 401,
  captcha_wrong: 400,
  captcha_expired: 400,
  rate_limited: 429,
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    assertSameOrigin(request);

    const body = await parseJsonBody(request, loginSchema);
    const ipHash = resolveIpHash(request.headers);
    const captchaSessionToken = request.cookies.get(CAPTCHA_SESSION_COOKIE)?.value ?? null;

    const result = await loginAdmin({
      username: body.username,
      password: body.password,
      captchaAnswer: body.captchaAnswer,
      captchaSessionToken,
      ipHash,
    });

    if (!result.ok) {
      return jsonError(ERROR_STATUS[result.error] ?? 400, result.error);
    }

    const response = jsonOk({ username: body.username.trim() });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: createSessionToken(body.username.trim()),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });
    return response;
  });
}
