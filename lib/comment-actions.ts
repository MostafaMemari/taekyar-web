"use server";

import { prisma } from "@/lib/prisma";
import type { CommentDraft } from "@/lib/comment-submission";
import { isValidEmail, MIN_MESSAGE_LENGTH } from "@/lib/validation";

export interface SubmitCommentResult {
  ok: boolean;
}

function toFaDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR").format(date);
}

export async function submitComment(
  slug: string,
  draft: CommentDraft,
  parentId?: string,
): Promise<SubmitCommentResult> {
  if (!draft.name.trim() || draft.message.trim().length < MIN_MESSAGE_LENGTH) {
    return { ok: false };
  }
  if (!isValidEmail(draft.email)) return { ok: false };

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!post) return { ok: false };

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true, parentId: true },
    });
    if (!parent || parent.postId !== post.id || parent.parentId) return { ok: false };
  }

  await prisma.comment.create({
    data: {
      postId: post.id,
      author: draft.name.trim(),
      role: "عضو تک‌یار",
      isTeamAuthor: false,
      date: toFaDate(new Date()),
      message: draft.message.trim(),
      status: "PENDING",
      parentId: parentId ?? null,
    },
  });

  return { ok: true };
}
