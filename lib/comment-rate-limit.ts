const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 4;

const GENERATION_WINDOW_MS = 10 * 60 * 1000;
const MAX_GENERATIONS_PER_WINDOW = 20;

const RATE_LIMIT_STORE_KEY = "__taekyarCommentRateLimit__";

type RateLimitStore = {
  attempts: Map<string, number[]>;
  generations: Map<string, number[]>;
};

type RateLimitGlobal = typeof globalThis & {
  __taekyarCommentRateLimit__?: RateLimitStore;
};

const globalForRateLimit = globalThis as RateLimitGlobal;

const store: RateLimitStore =
  globalForRateLimit[RATE_LIMIT_STORE_KEY] ?? {
    attempts: new Map<string, number[]>(),
    generations: new Map<string, number[]>(),
  };

globalForRateLimit[RATE_LIMIT_STORE_KEY] = store;

const attempts = store.attempts;
const generations = store.generations;

function recordAndCheck(store: Map<string, number[]>, ipHash: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;

  const recent = (store.get(ipHash) ?? []).filter((timestamp) => timestamp > cutoff);
  if (recent.length >= max) {
    store.set(ipHash, recent);
    return true;
  }

  recent.push(now);
  store.set(ipHash, recent);
  return false;
}

export function isAttemptRateLimited(ipHash: string): boolean {
  return recordAndCheck(attempts, ipHash, ATTEMPT_WINDOW_MS, MAX_ATTEMPTS_PER_WINDOW);
}

export function isGenerationRateLimited(ipHash: string): boolean {
  return recordAndCheck(generations, ipHash, GENERATION_WINDOW_MS, MAX_GENERATIONS_PER_WINDOW);
}