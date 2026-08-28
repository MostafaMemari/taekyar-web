"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import type { CommentDraft } from "@/lib/comment-submission";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, MIN_MESSAGE_LENGTH } from "@/lib/validation";
import {
  getClientIp,
  hashClientIp,
  sanitizeCommentText,
} from "@/lib/comment-security";
import { createCaptchaChallenge, validateCaptchaAnswer } from "@/lib/comment-captcha";
import { isAttemptRateLimited } from "@/lib/comment-rate-limit";

export type CommentRejectReason = "validation" | "captcha" | "rate_limited" | "not_found";

export interface SubmitCommentResult {
  ok: boolean;
  reason?: CommentRejectReason;
}

export interface CommentCaptchaChallenge {
  id: string;
  question: string;
}

const DB_RATE_WINDOW_MINUTES = 10;
const DB_RATE_MAX_COMMENTS = 3;

function toFaDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR").format(date);
}

export async function createCommentCaptcha(): Promise<CommentCaptchaChallenge> {
  const ip = getClientIp(await headers());
  return createCaptchaChallenge(ip ? hashClientIp(ip) : null);
}

export async function submitComment(
  slug: string,
  draft: CommentDraft,
  options: {
    parentId?: string;
    captchaId: string;
    captchaAnswer: string;
    honeypot: string;
  },
): Promise<SubmitCommentResult> {
  const ip = getClientIp(await headers());
  const ipHash = ip ? hashClientIp(ip) : null;

  if (options.honeypot) {
    return { ok: false, reason: "validation" };
  }

  if (ipHash && isAttemptRateLimited(ipHash)) {
    return { ok: false, reason: "rate_limited" };
  }

  if (!validateCaptchaAnswer(options.captchaId, options.captchaAnswer, ipHash)) {
    return { ok: false, reason: "captcha" };
  }

  const name = sanitizeCommentText(draft.name);
  const message = sanitizeCommentText(draft.message);

  if (
    !name ||
    name.length > MAX_NAME_LENGTH ||
    message.length < MIN_MESSAGE_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return { ok: false, reason: "validation" };
  }

  const post = await prisma.post.findUnique({
    where: { slug },
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

  if (options.parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: options.parentId },
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
      parentId: options.parentId ?? null,
    },
  });

  return { ok: true };
}
