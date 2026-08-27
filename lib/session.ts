import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload {
  username: string;
  exp: number;
}

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "";
}

function toBase64Url(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const body = toBase64Url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expectedSignature = sign(body);
  if (
    signature.length !== expectedSignature.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (!payload.username || typeof payload.exp !== "number") return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "taekyar_session";
export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE_SECONDS;
