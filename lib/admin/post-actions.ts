"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostFormState, PostInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { normalizePostInput, requireSession, revalidatePostPaths } from "./shared";

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
  } catch {
    return { status: "error", message: POST_FORM_LABELS.slugTaken };
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

  try {
    const { tagIds, ...postData } = data;
    await prisma.post.update({
      where: { slug: currentSlug },
      data: {
        ...postData,
        tags: { set: tagIds.map((id) => ({ id })) },
      },
    });
  } catch {
    return { status: "error", message: POST_FORM_LABELS.slugTaken };
  }

  revalidatePostPaths(currentSlug);
  if (data.slug !== currentSlug) revalidatePostPaths(data.slug);
  redirect("/dashboard/posts");
}

export async function deletePost(slug: string): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    await prisma.post.delete({ where: { slug } });
  } catch {
    return { ok: false };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard");
  revalidateTag("blog", "max");
  revalidateTag("posts", "max");
  return { ok: true };
}
