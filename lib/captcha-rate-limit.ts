import { redis } from "./redis";

const ATTEMPT_WINDOW_SECONDS = 10 * 60;
const MAX_ATTEMPTS_PER_WINDOW = 4;

const GENERATION_WINDOW_SECONDS = 10 * 60;
const MAX_GENERATIONS_PER_WINDOW = 20;

const ATTEMPT_KEY_PREFIX = "captcha:rate:attempt:";
const GENERATION_KEY_PREFIX = "captcha:rate:generation:";

export async function isAttemptRateLimited(ipHash: string): Promise<boolean> {
  const count = await redis.incr(ATTEMPT_KEY_PREFIX + ipHash);
  if (count === 1) await redis.expire(ATTEMPT_KEY_PREFIX + ipHash, ATTEMPT_WINDOW_SECONDS);
  return count > MAX_ATTEMPTS_PER_WINDOW;
}

export async function isGenerationRateLimited(ipHash: string): Promise<boolean> {
  const count = await redis.incr(GENERATION_KEY_PREFIX + ipHash);
  if (count === 1) await redis.expire(GENERATION_KEY_PREFIX + ipHash, GENERATION_WINDOW_SECONDS);
  return count > MAX_GENERATIONS_PER_WINDOW;
}
