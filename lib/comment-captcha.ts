import { createHash, randomUUID } from "crypto";

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const MAX_STORED_CHALLENGES = 500;
const DIGIT_COUNT_MIN = 4;
const DIGIT_COUNT_MAX = 5;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

interface CaptchaChallenge {
  answerHash: string;
  ipHash: string | null;
  expiresAt: number;
}

const challenges = new Map<string, CaptchaChallenge>();

function pepper(): string {
  return process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(AR_DIGITS.indexOf(digit)));
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function hashCaptchaAnswer(answer: string, captchaId: string): string {
  return createHash("sha256")
    .update(`${normalizeDigits(answer.trim())}${captchaId}${pepper()}`)
    .digest("hex");
}

function randomColorOpacity(minPercent: number, maxPercent: number): string {
  return (randomInt(minPercent, maxPercent) / 100).toFixed(2);
}

function generateCaptchaSvg(digits: string[]): string {
  const width = 190;
  const height = 68;
  const slot = (width - 24) / digits.length;
  const fontFamily = "font-family:var(--font-vazirmatn), Vazirmatn, Tahoma, sans-serif";

  let digitElements = "";
  digits.forEach((digit, index) => {
    const cx = 12 + slot * index + slot / 2 + randomInt(-3, 3);
    const cy = height / 2 + randomInt(-4, 4);
    const fontSize = randomInt(34, 46);
    const rotation = randomInt(-24, 24);
    digitElements += `<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central" font-weight="700" style="${fontFamily}" fill="currentColor" fill-opacity="${randomColorOpacity(72, 100)}" transform="rotate(${rotation} ${cx.toFixed(1)} ${cy.toFixed(1)})">${digit}</text>`;
  });

  let noise = "";
  for (let i = 0; i < randomInt(3, 4); i += 1) {
    const y1 = randomInt(6, height - 6);
    const y2 = randomInt(6, height - 6);
    if (Math.random() < 0.5) {
      noise += `<line x1="0" y1="${y1}" x2="${width}" y2="${y2}" stroke="currentColor" stroke-opacity="${randomColorOpacity(10, 22)}" stroke-width="1.5" />`;
    } else {
      const midY = (y1 + y2) / 2 + randomInt(-10, 10);
      noise += `<path d="M 0 ${y1} Q ${width / 2} ${midY} ${width} ${y2}" fill="none" stroke="currentColor" stroke-opacity="${randomColorOpacity(10, 22)}" stroke-width="1.5" />`;
    }
  }

  for (let i = 0; i < randomInt(24, 36); i += 1) {
    noise += `<circle cx="${randomInt(2, width - 2)}" cy="${randomInt(2, height - 2)}" r="${(randomInt(8, 22) / 10).toFixed(1)}" fill="currentColor" fill-opacity="${randomColorOpacity(12, 30)}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="کد امنیتی"><rect width="${width}" height="${height}" fill="transparent" />${noise}${digitElements}</svg>`;
}

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

export function createCaptchaChallenge(
  ipHash: string | null,
): { id: string; svg: string } {
  const now = Date.now();
  pruneExpired(now);

  const digitCount = randomInt(DIGIT_COUNT_MIN, DIGIT_COUNT_MAX);
  const digits: string[] = [];
  for (let i = 0; i < digitCount; i += 1) {
    digits.push(FA_DIGITS[randomInt(0, 9)]);
  }

  const id = randomUUID();
  const answerHash = hashCaptchaAnswer(digits.join(""), id);
  challenges.set(id, { answerHash, ipHash, expiresAt: now + CAPTCHA_TTL_MS });

  return { id, svg: generateCaptchaSvg(digits) };
}

export function validateCaptchaAnswer(
  id: string,
  answer: string,
  ipHash: string | null,
  now = Date.now(),
): boolean {
  const challenge = challenges.get(id);
  if (!challenge) return false;

  challenges.delete(id);

  if (challenge.ipHash !== ipHash) return false;
  if (challenge.expiresAt <= now) return false;

  const normalized = normalizeDigits(answer.trim());
  if (!/^\d+$/.test(normalized)) return false;
  if (normalized.length < DIGIT_COUNT_MIN || normalized.length > DIGIT_COUNT_MAX) return false;

  return hashCaptchaAnswer(normalized, id) === challenge.answerHash;
}