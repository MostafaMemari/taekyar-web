import { createHash } from "crypto";

function pepper(): string {
  return process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";
}

export function sanitizeCommentText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashClientIp(ip: string): string {
  return createHash("sha256").update(`${ip.trim()}${pepper()}`).digest("hex");
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headers.get("x-real-ip")?.trim() || "";
}