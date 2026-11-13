"use server";

import { prisma } from "@/lib/prisma";
import { requireSession, revalidateCommentTargets } from "./shared";

export async function setCommentStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
): Promise<{ ok: boolean }> {
  await requireSession();

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

  revalidateCommentTargets(comment.post.slug);

  return { ok: true };
}

export async function deleteComment(id: string): Promise<{ ok: boolean }> {
  await requireSession();

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

  revalidateCommentTargets(comment.post.slug);

  return { ok: true };
}
