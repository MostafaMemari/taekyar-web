import { createHash, randomUUID } from "crypto";
import { existsSync } from "fs";
import { join } from "path";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const MAX_STORED_CHALLENGES = 500;
const DIGIT_COUNT_MIN = 4;
const DIGIT_COUNT_MAX = 5;

const IMAGE_WIDTH = 190;
const IMAGE_HEIGHT = 68;
const IMAGE_CONTENT_TYPE = "image/png";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const CAPTCHA_FONT_PATH = join(process.cwd(), "lib/captcha-fonts/Vazirmatn-Regular.ttf");

interface CaptchaChallenge {
  answerHash: string;
  ipHash: string | null;
  expiresAt: number;
  image: Buffer;
}

const challenges = new Map<string, CaptchaChallenge>();

let fontRegistered = false;

function ensureFont(): void {
  if (fontRegistered) return;
  if (existsSync(CAPTCHA_FONT_PATH)) {
    GlobalFonts.registerFromPath(CAPTCHA_FONT_PATH, "Vazirmatn");
    fontRegistered = true;
  }
}

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

function randomOpacity(minPercent: number, maxPercent: number): number {
  return randomInt(minPercent, maxPercent) / 100;
}

export function hashCaptchaAnswer(answer: string, captchaId: string): string {
  return createHash("sha256")
    .update(`${normalizeDigits(answer.trim())}${captchaId}${pepper()}`)
    .digest("hex");
}

function renderCaptchaImage(digits: string[]): Buffer {
  ensureFont();

  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  ctx.fillStyle = "rgba(243, 244, 246, 0.9)";
  ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  const ink = "rgba(23, 23, 23, ";

  for (let i = 0; i < randomInt(3, 4); i += 1) {
    ctx.strokeStyle = `${ink}${randomOpacity(8, 20).toFixed(2)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(randomInt(0, 20), randomInt(4, IMAGE_HEIGHT - 4));
    if (Math.random() < 0.5) {
      ctx.lineTo(IMAGE_WIDTH, randomInt(4, IMAGE_HEIGHT - 4));
    } else {
      ctx.quadraticCurveTo(
        IMAGE_WIDTH / 2,
        randomInt(0, IMAGE_HEIGHT),
        IMAGE_WIDTH,
        randomInt(4, IMAGE_HEIGHT - 4),
      );
    }
    ctx.stroke();
  }

  for (let i = 0; i < randomInt(26, 40); i += 1) {
    ctx.fillStyle = `${ink}${randomOpacity(10, 26).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(randomInt(1, IMAGE_WIDTH - 1), randomInt(1, IMAGE_HEIGHT - 1), randomInt(1, 2), 0, Math.PI * 2);
    ctx.fill();
  }

  const slot = (IMAGE_WIDTH - 24) / digits.length;
  digits.forEach((digit, index) => {
    const x = 12 + slot * index + slot / 2 + randomInt(-3, 3);
    const y = IMAGE_HEIGHT / 2 + randomInt(-5, 5);
    const fontSize = randomInt(34, 46);
    const rotation = randomInt(-24, 24) * (Math.PI / 180);
    const skew = randomInt(-8, 8) / 100;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.transform(1, 0, skew, 1, 0, 0);
    ctx.font = `700 ${fontSize}px Vazirmatn, Tahoma, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `${ink}${randomOpacity(72, 100).toFixed(2)})`;
    ctx.fillText(digit, 0, 0);
    ctx.fillStyle = `${ink}${randomOpacity(70, 90).toFixed(2)})`;
    ctx.fillText(digit, 0.8, 0.8);
    ctx.restore();
  });

  return canvas.toBuffer("image/png");
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

export function createCaptchaChallenge(ipHash: string | null, explicitDigits?: string[]): { id: string } {
  const now = Date.now();
  pruneExpired(now);

  const isValidDigits =
    explicitDigits !== undefined &&
    explicitDigits.length >= DIGIT_COUNT_MIN &&
    explicitDigits.length <= DIGIT_COUNT_MAX &&
    explicitDigits.every((digit) => FA_DIGITS.includes(digit));

  const digits: string[] = isValidDigits
    ? explicitDigits
    : Array.from({ length: randomInt(DIGIT_COUNT_MIN, DIGIT_COUNT_MAX) }, () =>
        FA_DIGITS[randomInt(0, 9)],
      );

  const id = randomUUID();
  const answerHash = hashCaptchaAnswer(digits.join(""), id);
  const image = renderCaptchaImage(digits);

  challenges.set(id, { answerHash, ipHash, expiresAt: now + CAPTCHA_TTL_MS, image });

  return { id };
}

export function getCaptchaImage(id: string): { buffer: Buffer; contentType: string } | null {
  pruneExpired(Date.now());
  const challenge = challenges.get(id);
  if (!challenge) return null;
  return { buffer: challenge.image, contentType: IMAGE_CONTENT_TYPE };
}

export type CaptchaVerifyResult = "ok" | "wrong" | "expired";

export function verifyCaptchaAnswer(
  id: string,
  answer: string,
  ipHash: string | null,
  now = Date.now(),
): CaptchaVerifyResult {
  const challenge = challenges.get(id);
  if (!challenge) return "expired";

  challenges.delete(id);

  if (challenge.ipHash !== ipHash) return "expired";
  if (challenge.expiresAt <= now) return "expired";

  const normalized = normalizeDigits(answer.trim());
  if (!/^\d+$/.test(normalized)) return "wrong";
  if (normalized.length < DIGIT_COUNT_MIN || normalized.length > DIGIT_COUNT_MAX) return "wrong";

  return hashCaptchaAnswer(normalized, id) === challenge.answerHash ? "ok" : "wrong";
}