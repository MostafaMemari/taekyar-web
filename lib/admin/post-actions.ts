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

function formatFaDateText(value: Date): string {
  return new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" }).format(value);
}

export async function createPost(_previousState: PostFormState, input: PostInput): Promise<PostFormState> {
  await requireSession();

  const result = normalizePostInput(input);
  if (!result.ok) return { status: "error", fieldErrors: result.fieldErrors };

  const { data } = result;
  const publishDate = data.status === "PUBLISHED" ? formatFaDateText(new Date()) : null;
  try {
    const { tagIds, categoryIds, content, ...postData } = data;
    await prisma.post.create({
      data: {
        ...postData,
        content: content ?? Prisma.DbNull,
        date: publishDate,
        categories: { connect: categoryIds.map((id) => ({ id })) },
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    if (isSlugConflict(error)) {
      return { status: "error", fieldErrors: { slug: POST_FORM_LABELS.slugTaken } };
    }
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
  const result = normalizePostInput(rawInput);
  if (!result.ok) return { status: "error", fieldErrors: result.fieldErrors };
  const { data } = result;

  const current = await prisma.post.findUnique({
    where: { slug: currentSlug },
    select: { deletedAt: true, status: true, date: true },
  });
  if (!current || current.deletedAt) return { status: "error", message: POST_FORM_LABELS.error };

  const duplicate = await prisma.post.findUnique({
    where: { slug: data.slug },
    select: { slug: true },
  });
  if (duplicate && duplicate.slug !== currentSlug) {
    return { status: "error", fieldErrors: { slug: POST_FORM_LABELS.slugTaken } };
  }

  const firstPublication = data.status === "PUBLISHED" && !current.date;
  const publishDate = firstPublication ? formatFaDateText(new Date()) : current.date;

  try {
    const { tagIds, categoryIds, content, ...postData } = data;
    await prisma.post.update({
      where: { slug: currentSlug },
      data: {
        ...postData,
        content: content === null ? Prisma.DbNull : content,
        date: publishDate,
        categories: { set: categoryIds.map((id) => ({ id })) },
        tags: { set: tagIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    if (isSlugConflict(error)) {
      return { status: "error", fieldErrors: { slug: POST_FORM_LABELS.slugTaken } };
    }
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
