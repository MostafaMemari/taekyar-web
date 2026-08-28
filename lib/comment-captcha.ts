import { randomUUID } from "crypto";

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const MAX_STORED_CHALLENGES = 500;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const MINUS_SIGN = "\u2212";

function toPersianDigits(value: number): string {
  return String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)]);
}

interface CaptchaChallenge {
  answer: number;
  ipHash: string | null;
  expiresAt: number;
}

const challenges = new Map<string, CaptchaChallenge>();

function pruneExpired(now: number): void {
  for (const [id, challenge] of challenges) {
    if (challenge.expiresAt <= now) challenges.delete(id);
  }
  while (challenges.size > MAX_STORED_CHALLENGES) {
    const oldest = challenges.keys().next().value;
    if (oldest === undefined) break;
    challenges.delete(oldest);
  }
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function createCaptchaChallenge(ipHash: string | null): { id: string; question: string } {
  const now = Date.now();
  pruneExpired(now);

  const first = randomInt(2, 9);
  const second = randomInt(2, 9);
  const isAddition = Math.random() < 0.5 || first === second;
  const larger = Math.max(first, second);
  const smaller = Math.min(first, second);

  const answer = isAddition ? larger + smaller : larger - smaller;
  const question = isAddition
    ? `${toPersianDigits(larger)} + ${toPersianDigits(smaller)}`
    : `${toPersianDigits(larger)} ${MINUS_SIGN} ${toPersianDigits(smaller)}`;

  const id = randomUUID();
  challenges.set(id, { answer, ipHash, expiresAt: now + CAPTCHA_TTL_MS });

  return { id, question };
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(AR_DIGITS.indexOf(digit)));
}

export function validateCaptchaAnswer(
  id: string,
  answer: string,
  ipHash: string | null,
): boolean {
  const challenge = challenges.get(id);
  if (!challenge) return false;

  challenges.delete(id);

  if (challenge.ipHash !== ipHash) return false;
  if (challenge.expiresAt <= Date.now()) return false;

  const normalized = normalizeDigits(answer.trim());
  if (!/^\d+$/.test(normalized)) return false;

  return Number(normalized) === challenge.answer;
}