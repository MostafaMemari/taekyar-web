const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 4;

const attempts = new Map<string, number[]>();

export function isAttemptRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const cutoff = now - ATTEMPT_WINDOW_MS;

  const recent = (attempts.get(ipHash) ?? []).filter((timestamp) => timestamp > cutoff);
  if (recent.length >= MAX_ATTEMPTS_PER_WINDOW) {
    attempts.set(ipHash, recent);
    return true;
  }

  recent.push(now);
  attempts.set(ipHash, recent);
  return false;
}