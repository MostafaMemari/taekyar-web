import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { existsSync } from "fs";
import { join } from "path";
import { create, loadFont } from "svg-captcha";

import { redis } from "./redis";

export const CAPTCHA_SESSION_COOKIE = "tc_captcha";

const CAPTCHA_TTL_SECONDS = 5 * 60;
const SESSION_TTL_SECONDS = 10 * 60;

const DIGIT_COUNT_MIN = 4;
const DIGIT_COUNT_MAX = 5;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const CHALLENGE_KEY_PREFIX = "captcha:challenge:";

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 72;
const FONT_SIZE = 48;

const FONT_PATH = join(process.cwd(), "lib/captcha-fonts/Vazirmatn-Regular.ttf");

export type CaptchaVerifyResult = "ok" | "wrong" | "expired";

export interface CaptchaChallengeResult {
  id: string;
  svg: string;
  text: string;
}

interface StoredChallenge {
  id: string;
  answerHash: string;
  ipHash: string | null;
}

function pepper(): string {
  return process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(AR_DIGITS.indexOf(digit)));
}

export function hashCaptchaAnswer(answer: string, captchaId: string): string {
  return createHash("sha256")
    .update(`${normalizeDigits(answer.trim())}${captchaId}${pepper()}`)
    .digest("hex");
}

function hashesMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

let fontLoaded = false;

function ensureFont(): void {
  if (fontLoaded) return;
  if (existsSync(FONT_PATH)) loadFont(FONT_PATH);
  fontLoaded = true;
}

export function createCaptchaSessionToken(): string {
  return randomBytes(16).toString("base64url");
}

export const captchaSessionMaxAge = SESSION_TTL_SECONDS;

export async function createCaptchaChallenge(params: {
  sessionToken: string;
  ipHash: string | null;
  ttlSeconds?: number;
}): Promise<CaptchaChallengeResult> {
  ensureFont();

  const digitCount = randomInt(DIGIT_COUNT_MIN, DIGIT_COUNT_MAX + 1);
  const { data: svg, text } = create({
    charPreset: FA_DIGITS,
    size: digitCount,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    fontSize: FONT_SIZE,
    color: true,
  });

  const id = randomBytes(16).toString("base64url");
  const challenge: StoredChallenge = {
    id,
    answerHash: hashCaptchaAnswer(text, id),
    ipHash: params.ipHash,
  };

  await redis.set(
    CHALLENGE_KEY_PREFIX + params.sessionToken,
    JSON.stringify(challenge),
    "EX",
    params.ttlSeconds ?? CAPTCHA_TTL_SECONDS,
  );

  return { id, svg, text };
}

export async function verifyCaptchaAnswer(params: {
  sessionToken: string | null;
  answer: string;
  ipHash: string | null;
}): Promise<CaptchaVerifyResult> {
  if (!params.sessionToken) return "expired";

  const raw = await redis.getdel(CHALLENGE_KEY_PREFIX + params.sessionToken);
  if (!raw) return "expired";

  const challenge = JSON.parse(raw) as StoredChallenge;
  if (challenge.ipHash !== params.ipHash) return "expired";

  const normalized = normalizeDigits(params.answer.trim());
  const wellFormed =
    /^\d+$/.test(normalized) &&
    normalized.length >= DIGIT_COUNT_MIN &&
    normalized.length <= DIGIT_COUNT_MAX;

  if (!wellFormed) return "wrong";

  return hashesMatch(hashCaptchaAnswer(normalized, challenge.id), challenge.answerHash) ? "ok" : "wrong";
}
