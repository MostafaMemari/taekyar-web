import { prisma } from "@/server/config/prisma";
import { resolveIpHash } from "@/server/security/client";
import { isAttemptRateLimited, verifyCaptchaAnswer } from "@/server/services/captcha.service";

import type { SubmitCommentInput, SubmitCommentResult } from "@/types/api";

const DB_RATE_WINDOW_MINUTES = 10;
const DB_RATE_MAX_COMMENTS = 3;

const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 10;
const MAX_NAME_LENGTH = 60;

function sanitizeCommentText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toFaDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR").format(date);
}

export async function submitPublicComment(
  input: SubmitCommentInput,
  context: { headers: Headers; captchaSessionToken: string | null },
): Promise<SubmitCommentResult> {
  const ipHash = resolveIpHash(context.headers);

  if (input.honeypot) {
    return { ok: false, reason: "validation" };
  }

  if (ipHash && (await isAttemptRateLimited(ipHash))) {
    return { ok: false, reason: "rate_limited" };
  }

  const captchaResult = await verifyCaptchaAnswer({
    sessionToken: context.captchaSessionToken,
    answer: input.captchaAnswer,
    ipHash,
  });
  if (captchaResult === "wrong") return { ok: false, reason: "captcha_wrong" };
  if (captchaResult === "expired") return { ok: false, reason: "captcha_expired" };

  const name = sanitizeCommentText(input.name);
  const message = sanitizeCommentText(input.message);

  if (
    !name ||
    name.length > MAX_NAME_LENGTH ||
    message.length < MIN_MESSAGE_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return { ok: false, reason: "validation" };
  }

  const post = await prisma.post.findFirst({
    where: { slug: input.slug, status: "PUBLISHED", deletedAt: null },
    select: { id: true },
  });
  if (!post) return { ok: false, reason: "not_found" };

  if (ipHash) {
    const recentCount = await prisma.comment.count({
      where: {
        postId: post.id,
        ipHash,
        createdAt: {
          gte: new Date(Date.now() - DB_RATE_WINDOW_MINUTES * 60 * 1000),
        },
      },
    });
    if (recentCount >= DB_RATE_MAX_COMMENTS) {
      return { ok: false, reason: "rate_limited" };
    }
  }

  if (input.parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: input.parentId },
      select: { postId: true, parentId: true },
    });
    if (!parent || parent.postId !== post.id || parent.parentId) {
      return { ok: false, reason: "validation" };
    }
  }

  await prisma.comment.create({
    data: {
      postId: post.id,
      author: name,
      role: "عضو تک‌یار",
      isTeamAuthor: false,
      date: toFaDate(new Date()),
      message,
      ipHash,
      status: "PENDING",
      parentId: input.parentId ?? null,
    },
  });

  return { ok: true };
}

export async function setCommentStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
): Promise<{ ok: boolean; postSlug?: string }> {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { post: { select: { slug: true } } },
  });
  if (!comment) return { ok: false };

  try {
    await prisma.comment.update({ where: { id }, data: { status } });
  } catch {
    return { ok: false };
  }

  return { ok: true, postSlug: comment.post.slug };
}

export async function deleteComment(id: string): Promise<{ ok: boolean; postSlug?: string }> {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { post: { select: { slug: true } } },
  });
  if (!comment) return { ok: false };

  try {
    await prisma.comment.delete({ where: { id } });
  } catch {
    return { ok: false };
  }

  return { ok: true, postSlug: comment.post.slug };
}
