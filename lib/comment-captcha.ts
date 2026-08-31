import { createHash, randomBytes, randomInt as cryptoRandomInt, timingSafeEqual } from "crypto";
import { existsSync } from "fs";
import { join } from "path";
import { createCanvas, GlobalFonts, type SKRSContext2D } from "@napi-rs/canvas";

export const CAPTCHA_SESSION_COOKIE = "tc_captcha";

const CAPTCHA_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_SECONDS = 10 * 60;
const MAX_STORED_CHALLENGES = 500;
const MAX_LIVE_CHALLENGES_PER_SESSION = 6;

const DIGIT_COUNT_MIN = 4;
const DIGIT_COUNT_MAX = 5;

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 72;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const BUNDLED_FONT_PATH = join(process.cwd(), "lib/captcha-fonts/Vazirmatn-Regular.ttf");
const BUNDLED_FONT_FAMILY = "CaptchaVazirmatn";

const SYSTEM_FONT_CANDIDATES = [
  "Tahoma",
  "Arial",
  "Segoe UI",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "Courier New",
];
const MAX_SYSTEM_FONTS = 3;

const PROBE_DIGIT = "۵";
const PROBE_MISSING = "";

interface CaptchaChallenge {
  answerHash: string;
  sessionToken: string;
  ipHash: string | null;
  createdAt: number;
  expiresAt: number;
}

export interface CaptchaImage {
  buffer: Buffer;
  contentType: string;
}

export type CaptchaVerifyResult = "ok" | "wrong" | "expired";

const CHALLENGE_STORE_KEY = "__taekyarCaptchaChallenges__";

type CaptchaStoreGlobal = typeof globalThis & {
  __taekyarCaptchaChallenges__?: Map<string, CaptchaChallenge>;
};

const globalForCaptcha = globalThis as CaptchaStoreGlobal;

const challenges: Map<string, CaptchaChallenge> =
  globalForCaptcha[CHALLENGE_STORE_KEY] ?? new Map<string, CaptchaChallenge>();

globalForCaptcha[CHALLENGE_STORE_KEY] = challenges;

function pepper(): string {
  return process.env.COMMENT_IP_PEPPER ?? "taekyar-comment-ip-pepper";
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(FA_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(AR_DIGITS.indexOf(digit)));
}

function pickInt(min: number, max: number): number {
  return cryptoRandomInt(min, max + 1);
}

function pickFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickOne<T>(items: readonly T[]): T {
  return items[cryptoRandomInt(0, items.length)];
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

function renderGlyphProbe(family: string, char: string): string {
  const canvas = createCanvas(80, 80);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 80, 80);
  ctx.fillStyle = "#000000";
  ctx.font = `56px "${family}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 40, 40);
  return canvas.toBuffer("image/png").toString("base64");
}

function supportsPersianDigits(family: string): boolean {
  try {
    const blank = renderGlyphProbe(family, "");
    const digit = renderGlyphProbe(family, PROBE_DIGIT);
    if (digit === blank) return false;
    return digit !== renderGlyphProbe(family, PROBE_MISSING);
  } catch {
    return false;
  }
}

let resolvedFonts: string[] | null = null;

function ensureFonts(): string[] {
  if (resolvedFonts) return resolvedFonts;

  const fonts: string[] = [];

  if (existsSync(BUNDLED_FONT_PATH)) {
    GlobalFonts.registerFromPath(BUNDLED_FONT_PATH, BUNDLED_FONT_FAMILY);
    fonts.push(BUNDLED_FONT_FAMILY);
  }

  for (const family of SYSTEM_FONT_CANDIDATES) {
    if (fonts.length >= MAX_SYSTEM_FONTS + 1) break;
    if (supportsPersianDigits(family)) fonts.push(family);
  }

  resolvedFonts = fonts.length > 0 ? fonts : ["sans-serif"];
  return resolvedFonts;
}

function drawBackground(ctx: SKRSContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  const hue = pickInt(195, 255);
  gradient.addColorStop(0, `hsl(${hue}, 24%, 97%)`);
  gradient.addColorStop(1, `hsl(${hue + pickInt(-30, 30)}, 18%, 90%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  for (let i = 0; i < pickInt(3, 6); i += 1) {
    ctx.fillStyle = `hsla(${pickInt(190, 260)}, 30%, 70%, ${pickFloat(0.04, 0.1).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(
      pickFloat(0, IMAGE_WIDTH),
      pickFloat(0, IMAGE_HEIGHT),
      pickFloat(14, 46),
      pickFloat(8, 26),
      pickFloat(0, Math.PI),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function drawNoise(ctx: SKRSContext2D): void {
  for (let i = 0; i < pickInt(3, 5); i += 1) {
    ctx.strokeStyle = `hsla(${pickInt(190, 280)}, ${pickInt(20, 55)}%, ${pickInt(30, 62)}%, ${pickFloat(0.16, 0.4).toFixed(3)})`;
    ctx.lineWidth = pickFloat(0.8, 2.2);
    ctx.lineCap = "round";
    ctx.beginPath();
    const startY = pickFloat(2, IMAGE_HEIGHT - 2);
    const endY = pickFloat(2, IMAGE_HEIGHT - 2);
    ctx.moveTo(pickFloat(-6, 12), startY);
    if (Math.random() < 0.5) {
      ctx.quadraticCurveTo(IMAGE_WIDTH / 2, pickFloat(-10, IMAGE_HEIGHT + 10), IMAGE_WIDTH + 6, endY);
    } else {
      ctx.bezierCurveTo(
        IMAGE_WIDTH * 0.33,
        pickFloat(-8, IMAGE_HEIGHT + 8),
        IMAGE_WIDTH * 0.66,
        pickFloat(-8, IMAGE_HEIGHT + 8),
        IMAGE_WIDTH + 6,
        endY,
      );
    }
    ctx.stroke();
  }

  const dots = pickInt(40, 90);
  for (let i = 0; i < dots; i += 1) {
    ctx.fillStyle = `hsla(${pickInt(190, 290)}, ${pickInt(15, 60)}%, ${pickInt(25, 65)}%, ${pickFloat(0.15, 0.5).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(pickFloat(0, IMAGE_WIDTH), pickFloat(0, IMAGE_HEIGHT), pickFloat(0.5, 1.9), 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < pickInt(6, 14); i += 1) {
    const x = pickFloat(0, IMAGE_WIDTH);
    const y = pickFloat(0, IMAGE_HEIGHT);
    const length = pickFloat(3, 12);
    ctx.strokeStyle = `hsla(${pickInt(190, 290)}, 25%, 45%, ${pickFloat(0.12, 0.3).toFixed(3)})`;
    ctx.lineWidth = pickFloat(0.6, 1.4);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + pickFloat(-4, 4));
    ctx.stroke();
  }
}

function drawDigits(ctx: SKRSContext2D, digits: string[], fonts: string[]): void {
  const padding = 14;
  const slot = (IMAGE_WIDTH - padding * 2) / digits.length;

  digits.forEach((digit, index) => {
    const font = pickOne(fonts);
    const fontSize = pickInt(34, 46);
    const rotation = pickFloat(-0.38, 0.38);
    const skew = pickFloat(-0.12, 0.12);
    const scaleX = pickFloat(0.84, 1.18);
    const scaleY = pickFloat(0.92, 1.12);
    const weight = pickFloat(0, 1.5);
    const x = padding + slot * index + slot / 2 + pickFloat(-4, 4);
    const y = IMAGE_HEIGHT / 2 + pickFloat(-6, 6);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.transform(scaleX, 0, skew, scaleY, 0, 0);
    ctx.font = `${fontSize}px "${font}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const hue = pickInt(200, 265);
    const ink = `hsla(${hue}, ${pickInt(18, 45)}%, ${pickInt(8, 26)}%, ${pickFloat(0.82, 1).toFixed(3)})`;
    ctx.fillStyle = ink;
    ctx.fillText(digit, 0, 0);

    if (weight > 0.35) {
      ctx.lineWidth = weight;
      ctx.lineJoin = "round";
      ctx.strokeStyle = ink;
      ctx.strokeText(digit, 0, 0);
    }

    ctx.fillStyle = `hsla(${hue}, 20%, 40%, ${pickFloat(0.12, 0.26).toFixed(3)})`;
    ctx.fillText(digit, pickFloat(0.6, 1.6), pickFloat(0.6, 1.6));

    ctx.restore();
  });
}

function renderCaptchaImage(digits: string[]): CaptchaImage {
  const fonts = ensureFonts();
  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  drawBackground(ctx);
  drawNoise(ctx);
  drawDigits(ctx, digits, fonts);

  try {
    return { buffer: canvas.toBuffer("image/webp"), contentType: "image/webp" };
  } catch {
    return { buffer: canvas.toBuffer("image/png"), contentType: "image/png" };
  }
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

function dropOldestForSession(sessionToken: string): void {
  let oldestId: string | null = null;
  let oldestAt = Number.POSITIVE_INFINITY;
  let count = 0;

  for (const [id, challenge] of challenges) {
    if (challenge.sessionToken !== sessionToken) continue;
    count += 1;
    if (challenge.createdAt < oldestAt) {
      oldestAt = challenge.createdAt;
      oldestId = id;
    }
  }

  if (oldestId !== null && count >= MAX_LIVE_CHALLENGES_PER_SESSION) {
    challenges.delete(oldestId);
  }
}

export function createCaptchaSessionToken(): string {
  return randomBytes(16).toString("base64url");
}

export const captchaSessionMaxAge = SESSION_TTL_SECONDS;

export function createCaptchaChallenge(params: {
  sessionToken: string;
  ipHash: string | null;
  forcedDigits?: string[];
}): { id: string; image: CaptchaImage } {
  const now = Date.now();
  pruneExpired(now);
  dropOldestForSession(params.sessionToken);

  const forced = params.forcedDigits;
  const useForced =
    forced !== undefined &&
    forced.length >= DIGIT_COUNT_MIN &&
    forced.length <= DIGIT_COUNT_MAX &&
    forced.every((digit) => FA_DIGITS.includes(digit));

  const digits = useForced
    ? (forced as string[])
    : Array.from({ length: pickInt(DIGIT_COUNT_MIN, DIGIT_COUNT_MAX) }, () => FA_DIGITS[cryptoRandomInt(0, 10)]);

  const id = randomBytes(16).toString("base64url");
  const answerHash = hashCaptchaAnswer(digits.join(""), id);

  challenges.set(id, {
    answerHash,
    sessionToken: params.sessionToken,
    ipHash: params.ipHash,
    createdAt: now,
    expiresAt: now + CAPTCHA_TTL_MS,
  });

  return { id, image: renderCaptchaImage(digits) };
}

interface LiveChallenge {
  id: string;
  challenge: CaptchaChallenge;
}

function liveChallengesFor(sessionToken: string, ipHash: string | null, now: number): LiveChallenge[] {
  const found: LiveChallenge[] = [];
  for (const [id, challenge] of challenges) {
    if (challenge.expiresAt <= now) continue;
    if (challenge.sessionToken !== sessionToken) continue;
    if (challenge.ipHash !== ipHash) continue;
    found.push({ id, challenge });
  }
  return found.sort((a, b) => b.challenge.createdAt - a.challenge.createdAt);
}

export function verifyCaptchaAnswer(params: {
  sessionToken: string | null;
  answer: string;
  ipHash: string | null;
  now?: number;
}): CaptchaVerifyResult {
  const now = params.now ?? Date.now();
  pruneExpired(now);

  if (!params.sessionToken) return "expired";

  const live = liveChallengesFor(params.sessionToken, params.ipHash, now);
  if (live.length === 0) {
    console.warn(`[captcha-debug] store-miss pid=${process.pid} hadSession=${Boolean(params.sessionToken)}`);
    return "expired";
  }

  const normalized = normalizeDigits(params.answer.trim());
  const wellFormed =
    /^\d+$/.test(normalized) &&
    normalized.length >= DIGIT_COUNT_MIN &&
    normalized.length <= DIGIT_COUNT_MAX;

  if (wellFormed) {
    const match = live.find(({ id, challenge }) =>
      hashesMatch(hashCaptchaAnswer(normalized, id), challenge.answerHash),
    );
    if (match) {
      challenges.delete(match.id);
      return "ok";
    }
  }

  challenges.delete(live[0].id);
  return "wrong";
}
