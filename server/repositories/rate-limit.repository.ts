import { prisma } from "@/server/config/prisma";

export async function incrementWindowCounter(key: string, windowSeconds: number): Promise<number> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimitCounter" ("key", "count", "windowStart", "expiresAt")
    VALUES (${key}, 1, ${now}, ${expiresAt})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimitCounter"."expiresAt" < ${now} THEN 1 ELSE "RateLimitCounter"."count" + 1 END,
      "windowStart" = CASE WHEN "RateLimitCounter"."expiresAt" < ${now} THEN ${now} ELSE "RateLimitCounter"."windowStart" END,
      "expiresAt" = CASE WHEN "RateLimitCounter"."expiresAt" < ${now} THEN ${expiresAt} ELSE "RateLimitCounter"."expiresAt" END
    RETURNING "count"
  `;

  return rows[0]?.count ?? 1;
}

export async function deleteExpiredCounters(now: Date): Promise<void> {
  await prisma.rateLimitCounter.deleteMany({ where: { expiresAt: { lt: now } } });
}
