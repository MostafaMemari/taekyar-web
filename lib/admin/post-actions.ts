"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostFormState, PostInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { normalizePostInput, requireSession, revalidatePostPaths } from "./shared";

function isSlugConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createPost(_previousState: PostFormState, input: PostInput): Promise<PostFormState> {
  await requireSession();

  const data = normalizePostInput(input);
  if (!data) return { status: "error", message: POST_FORM_LABELS.error };

  try {
    const { tagIds, ...postData } = data;
    await prisma.post.create({
      data: {
        ...postData,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    if (isSlugConflict(error)) return { status: "error", message: POST_FORM_LABELS.slugTaken };
    console.error("createPost failed:", error);
    return { status: "error", message: POST_FORM_LABELS.error };
  }

  revalidatePostPaths(data.slug);
  redirect("/dashboard/posts");
}

export async function updatePost(
  _previousState: PostFormState,
  input: PostInput & { currentSlug: string },
): Promise<PostFormState> {
  await requireSession();

  const { currentSlug, ...rawInput } = input;
  const data = normalizePostInput(rawInput);
  if (!data) return { status: "error", message: POST_FORM_LABELS.error };

  const current = await prisma.post.findUnique({
    where: { slug: currentSlug },
    select: { deletedAt: true },
  });
  if (!current || current.deletedAt) return { status: "error", message: POST_FORM_LABELS.error };

  const duplicate = await prisma.post.findUnique({
    where: { slug: data.slug },
    select: { slug: true },
  });
  if (duplicate && duplicate.slug !== currentSlug) {
    return { status: "error", message: POST_FORM_LABELS.slugTaken };
  }

  try {
    const { tagIds, ...postData } = data;
    await prisma.post.update({
      where: { slug: currentSlug },
      data: {
        ...postData,
        tags: { set: tagIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    if (isSlugConflict(error)) return { status: "error", message: POST_FORM_LABELS.slugTaken };
    console.error("updatePost failed:", error);
    return { status: "error", message: POST_FORM_LABELS.error };
  }

  revalidatePostPaths(currentSlug);
  if (data.slug !== currentSlug) revalidatePostPaths(data.slug);
  redirect("/dashboard/posts");
}

export async function trashPost(slug: string): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    const result = await prisma.post.updateMany({
      where: { slug, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) return { ok: false };
  } catch {
    return { ok: false };
  }

  revalidatePostPaths(slug);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function restorePost(slug: string): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    const result = await prisma.post.updateMany({
      where: { slug, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
    if (result.count === 0) return { ok: false };
  } catch {
    return { ok: false };
  }

  revalidatePostPaths(slug);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deletePostPermanently(slug: string): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    await prisma.post.delete({ where: { slug } });
  } catch {
    return { ok: false };
  }

  revalidatePostPaths(slug);
  revalidatePath("/dashboard");
  return { ok: true };
}
