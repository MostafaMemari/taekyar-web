"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "./shared";

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

  revalidatePath(`/blog/${comment.post.slug}`);
  revalidatePath("/dashboard/comments");
  revalidatePath("/dashboard");
  revalidateTag("blog", "max");
  revalidateTag("comments", "max");
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

  revalidatePath(`/blog/${comment.post.slug}`);
  revalidatePath("/dashboard/comments");
  revalidatePath("/dashboard");
  revalidateTag("blog", "max");
  revalidateTag("comments", "max");
  return { ok: true };
}
