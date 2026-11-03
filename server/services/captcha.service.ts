import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { create, loadFont } from "svg-captcha";

import { getIpPepper } from "@/server/config/env";
import {
  consumeChallenge,
  deleteExpiredChallenges,
  storeChallenge,
} from "@/server/repositories/captcha.repository";
import {
  deleteExpiredCounters,
  incrementWindowCounter,
} from "@/server/repositories/rate-limit.repository";

export const CAPTCHA_SESSION_COOKIE = "tc_captcha";

const CAPTCHA_TTL_SECONDS = 5 * 60;
const SESSION_TTL_SECONDS = 10 * 60;

const DIGIT_COUNT_MIN = 4;
const DIGIT_COUNT_MAX = 5;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const ATTEMPT_WINDOW_SECONDS = 10 * 60;
const MAX_ATTEMPTS_PER_WINDOW = 4;

const GENERATION_WINDOW_SECONDS = 10 * 60;
const MAX_GENERATIONS_PER_WINDOW = 20;

const ATTEMPT_RATE_KEY = "captcha:attempt:";
const GENERATION_RATE_KEY = "captcha:generation:";

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 72;
const FONT_SIZE = 48;

const FONT_PATH = join(process.cwd(), "fonts/vazirmatn/Vazirmatn-Regular.ttf");

export type CaptchaVerifyResult = "ok" | "wrong" | "expired";

export interface CaptchaChallengeResult {
  id: string;
  svg: string;
}

interface CaptchaAnswerContext {
  sessionToken: string | null;
  answer: string;
  ipHash: string | null;
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(AR_DIGITS.indexOf(digit)));
}

function hashCaptchaAnswer(answer: string, captchaId: string): string {
  return createHash("sha256")
    .update(`${normalizeDigits(answer.trim())}${captchaId}${getIpPepper()}`)
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
  const now = new Date();

  await storeChallenge({
    sessionToken: params.sessionToken,
    challengeId: id,
    answerHash: hashCaptchaAnswer(text, id),
    ipHash: params.ipHash,
    expiresAt: new Date(now.getTime() + CAPTCHA_TTL_SECONDS * 1000),
  });

  await deleteExpiredChallenges(now);
  await deleteExpiredCounters(now);

  return { id, svg };
}

export async function verifyCaptchaAnswer(params: CaptchaAnswerContext): Promise<CaptchaVerifyResult> {
  if (!params.sessionToken) return "expired";

  const challenge = await consumeChallenge(params.sessionToken);
  if (!challenge) return "expired";

  if (challenge.ipHash !== params.ipHash) return "expired";

  const normalized = normalizeDigits(params.answer.trim());
  const wellFormed =
    /^\d+$/.test(normalized) &&
    normalized.length >= DIGIT_COUNT_MIN &&
    normalized.length <= DIGIT_COUNT_MAX;

  if (!wellFormed) return "wrong";

  return hashesMatch(hashCaptchaAnswer(normalized, challenge.challengeId), challenge.answerHash)
    ? "ok"
    : "wrong";
}

export async function isAttemptRateLimited(ipHash: string): Promise<boolean> {
  const count = await incrementWindowCounter(ATTEMPT_RATE_KEY + ipHash, ATTEMPT_WINDOW_SECONDS);
  return count > MAX_ATTEMPTS_PER_WINDOW;
}

export async function isGenerationRateLimited(ipHash: string): Promise<boolean> {
  const count = await incrementWindowCounter(GENERATION_RATE_KEY + ipHash, GENERATION_WINDOW_SECONDS);
  return count > MAX_GENERATIONS_PER_WINDOW;
}
