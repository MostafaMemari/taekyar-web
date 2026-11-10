import { isRateLimited } from "./rate-limit";

const ATTEMPT_WINDOW_SECONDS = 10 * 60;
const MAX_ATTEMPTS_PER_WINDOW = 4;

const GENERATION_WINDOW_SECONDS = 10 * 60;
const MAX_GENERATIONS_PER_WINDOW = 20;

const ATTEMPT_KEY_PREFIX = "captcha:rate:attempt:";
const GENERATION_KEY_PREFIX = "captcha:rate:generation:";

export async function isAttemptRateLimited(ipHash: string): Promise<boolean> {
  return isRateLimited(ATTEMPT_KEY_PREFIX + ipHash, {
    max: MAX_ATTEMPTS_PER_WINDOW,
    windowSeconds: ATTEMPT_WINDOW_SECONDS,
  });
}

export async function isGenerationRateLimited(ipHash: string): Promise<boolean> {
  return isRateLimited(GENERATION_KEY_PREFIX + ipHash, {
    max: MAX_GENERATIONS_PER_WINDOW,
    windowSeconds: GENERATION_WINDOW_SECONDS,
  });
}
