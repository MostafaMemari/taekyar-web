const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getActivityWindowStart(weeks: number): Date {
  return new Date(Date.now() - weeks * WEEK_MS);
}

export function buildWeeklyActivityBuckets(
  comments: Array<{ createdAt: Date }>,
  weeks: number,
): number[] {
  const now = Date.now();
  const buckets = Array.from({ length: weeks }, () => 0);

  for (const comment of comments) {
    const index = weeks - 1 - Math.floor((now - comment.createdAt.getTime()) / WEEK_MS);
    if (index >= 0 && index < weeks) buckets[index] += 1;
  }

  return buckets;
}
