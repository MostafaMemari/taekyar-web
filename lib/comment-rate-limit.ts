const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 4;

const GENERATION_WINDOW_MS = 10 * 60 * 1000;
const MAX_GENERATIONS_PER_WINDOW = 20;

const attempts = new Map<string, number[]>();
const generations = new Map<string, number[]>();

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