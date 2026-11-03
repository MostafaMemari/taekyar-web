import { NextResponse, type NextRequest } from "next/server";

import { handleApi } from "@/server/http/api";
import { resolveIpHash } from "@/server/security/client";
import {
  CAPTCHA_SESSION_COOKIE,
  captchaSessionMaxAge,
  createCaptchaChallenge,
  createCaptchaSessionToken,
  isGenerationRateLimited,
} from "@/server/services/captcha.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_STORE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApi(async () => {
    const ipHash = resolveIpHash(request.headers);

    if (ipHash && (await isGenerationRateLimited(ipHash))) {
      return new NextResponse(null, {
        status: 429,
        headers: { ...NO_STORE_HEADERS, "Retry-After": "60" },
      });
    }

    const existingToken = request.cookies.get(CAPTCHA_SESSION_COOKIE)?.value ?? null;
    const sessionToken = existingToken ?? createCaptchaSessionToken();

    const { svg } = await createCaptchaChallenge({ sessionToken, ipHash });

    const response = new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Content-Length": String(Buffer.byteLength(svg, "utf8")),
        ...NO_STORE_HEADERS,
        "Surrogate-Control": "no-store",
        "Last-Modified": new Date(0).toUTCString(),
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, noimageindex",
      },
    });

    response.cookies.set({
      name: CAPTCHA_SESSION_COOKIE,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: captchaSessionMaxAge,
    });

    return response;
  });
}
