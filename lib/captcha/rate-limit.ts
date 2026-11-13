import { prisma } from "../prisma";

interface RateLimitOptions {
  max: number;
  windowSeconds: number;
}

export async function isRateLimited(key: string, options: RateLimitOptions): Promise<boolean> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + options.windowSeconds * 1000);

  const bumped = await prisma.rateLimitCounter.updateMany({
    where: { key, resetAt: { gt: now } },
    data: { count: { increment: 1 } },
  });

  if (bumped.count === 0) {
    await prisma.rateLimitCounter.upsert({
      where: { key },
      create: { key, count: 1, resetAt },
      update: { count: 1, resetAt },
    });
  }

  const counter = await prisma.rateLimitCounter.findUniqueOrThrow({
    where: { key },
    select: { count: true },
  });

  return counter.count > options.max;
}

export async function cleanupExpiredRateLimits(): Promise<void> {
  await prisma.rateLimitCounter.deleteMany({
    where: { resetAt: { lt: new Date() } },
  });
}
