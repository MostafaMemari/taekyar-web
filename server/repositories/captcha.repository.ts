import { prisma } from "@/server/config/prisma";

export interface CaptchaChallengeRow {
  challengeId: string;
  answerHash: string;
  ipHash: string | null;
}

export interface StoredChallenge {
  sessionToken: string;
  challengeId: string;
  answerHash: string;
  ipHash: string | null;
  expiresAt: Date;
}

export async function storeChallenge(challenge: StoredChallenge): Promise<void> {
  await prisma.captchaChallenge.upsert({
    where: { sessionToken: challenge.sessionToken },
    create: challenge,
    update: {
      challengeId: challenge.challengeId,
      answerHash: challenge.answerHash,
      ipHash: challenge.ipHash,
      expiresAt: challenge.expiresAt,
      createdAt: new Date(),
    },
  });
}

export async function consumeChallenge(sessionToken: string): Promise<CaptchaChallengeRow | null> {
  const rows = await prisma.$queryRaw<{ challengeId: string; answerHash: string; ipHash: string | null }[]>`
    DELETE FROM "CaptchaChallenge"
    WHERE "sessionToken" = ${sessionToken} AND "expiresAt" > NOW()
    RETURNING "challengeId", "answerHash", "ipHash"
  `;
  return rows[0] ?? null;
}

export async function deleteExpiredChallenges(now: Date): Promise<void> {
  await prisma.captchaChallenge.deleteMany({ where: { expiresAt: { lt: now } } });
}
