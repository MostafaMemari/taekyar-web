import { NextResponse } from "next/server";

import {
  CAPTCHA_SESSION_COOKIE,
  captchaSessionMaxAge,
  createCaptchaChallenge,
  createCaptchaSessionToken,
} from "@/lib/comment-captcha";
import { isGenerationRateLimited } from "@/lib/comment-rate-limit";
import { getClientIp, hashClientIp } from "@/lib/comment-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export function GET(request: Request): NextResponse {
  const ip = getClientIp(request.headers);
  const ipHash = ip ? hashClientIp(ip) : null;

  if (ipHash && isGenerationRateLimited(ipHash)) {
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

  const { image } = createCaptchaChallenge({ sessionToken, ipHash });

  const response = new NextResponse(new Uint8Array(image.buffer), {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.buffer.byteLength),
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
