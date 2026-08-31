import { NextResponse } from "next/server";

import {
  CAPTCHA_SESSION_COOKIE,
  captchaSessionMaxAge,
  createCaptchaChallenge,
  createCaptchaSessionToken,
} from "@/lib/captcha";
import { isGenerationRateLimited } from "@/lib/captcha-rate-limit";
import { getClientIp, hashClientIp } from "@/lib/comment-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request.headers);
  const ipHash = ip ? hashClientIp(ip) : null;

  if (ipHash && (await isGenerationRateLimited(ipHash))) {
    return new NextResponse(null, {
      status: 429,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Retry-After": "60",
      },
    });
  }

  const existingToken = readCookie(request.headers.get("cookie"), CAPTCHA_SESSION_COOKIE);
  const sessionToken = existingToken ?? createCaptchaSessionToken();

  const { svg } = await createCaptchaChallenge({ sessionToken, ipHash });

  const response = new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Length": String(Buffer.byteLength(svg, "utf8")),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
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
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      const value = rest.join("=");
      return value.length > 0 ? decodeURIComponent(value) : null;
    }
  }
  return null;
}
