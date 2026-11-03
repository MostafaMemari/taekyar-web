import { createHash } from "node:crypto";

import { getIpPepper } from "@/server/config/env";

export function hashClientIp(ip: string): string {
  return createHash("sha256").update(`${ip.trim()}${getIpPepper()}`).digest("hex");
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip")?.trim() || "";
}

export function resolveIpHash(headers: Headers): string | null {
  const ip = getClientIp(headers);
  return ip ? hashClientIp(ip) : null;
}
