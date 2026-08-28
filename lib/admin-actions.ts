"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { endSession, getSession, startSession } from "@/lib/auth";
import type {
  LoginState,
  PostFormState,
  PostInput,
  TaxonomyInput,
} from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { deleteImage, uploadImage } from "@/lib/r2";
import { r2PublicUrl } from "@/lib/r2-url";
import { verifyPassword } from "@/lib/session";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

function revalidatePostPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard/comments");
}

function normalizeOptionalText(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function normalizeTaxonomyInput(
  input: TaxonomyInput,
): TaxonomyInput | null {
  const name = String(input.name ?? "").trim();
  const slug = String(input.slug ?? "").trim().toLowerCase();
  if (!name || !slug) return null;

  return {
    name,
    slug,
    image: normalizeOptionalText(input.image),
    metaTitle: normalizeOptionalText(input.metaTitle),
    metaDescription: normalizeOptionalText(input.metaDescription),
  };
}

function normalizePostInput(input: PostInput): PostInput | null {
  const title = String(input.title ?? "").trim();
  const slug = String(input.slug ?? "").trim().toLowerCase();
  const excerpt = String(input.excerpt ?? "").trim();
  const categoryId = Number(input.categoryId);
  const tagIds = Array.isArray(input.tagIds)
    ? input.tagIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [];
  const date = String(input.date ?? "").trim();
  const readTimeMinutes = Number(input.readTimeMinutes);

  if (!title || !slug || !excerpt || !date) return null;
  if (!Number.isInteger(categoryId) || categoryId <= 0) return null;
  if (!Number.isFinite(readTimeMinutes) || readTimeMinutes <= 0) return null;

  const content = Array.isArray(input.content)
    ? input.content.map((block) => {
        if (block.type === "list") {
          return {
            type: "list" as const,
            items: (Array.isArray(block.items) ? block.items : [])
              .map((item) => String(item).trim())
              .filter(Boolean),
          };
        }
        return { type: block.type, text: String(block.text ?? "").trim() };
      })
    : [];

  return {
    title,
    slug,
    excerpt,
    categoryId,
    tagIds,
    date,
    readTimeMinutes,
    content,
    metaTitle: normalizeOptionalText(input.metaTitle),
    metaDescription: normalizeOptionalText(input.metaDescription),
  };
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) return {};

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "invalid" };
  }

  await startSession(username);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}

export async function createPost(
  _previousState: PostFormState,
  input: PostInput,
): Promise<PostFormState> {
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
  return { ok: true };
}

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
  return { ok: true };
}

function revalidateTaxonomy(kind: "categories" | "tags") {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/dashboard/${kind}`);
  revalidatePath("/dashboard");
}

export async function saveTaxonomy(
  kind: "category" | "tag",
  id: number | null,
  input: TaxonomyInput,
): Promise<PostFormState> {
  await requireSession();

  const data = normalizeTaxonomyInput(input);
  if (!data) return { status: "error", message: POST_FORM_LABELS.error };

  try {
    if (kind === "category") {
      if (id === null) {
        await prisma.category.create({ data });
      } else {
        await prisma.category.update({ where: { id }, data });
      }
    } else if (id === null) {
      await prisma.tag.create({ data });
    } else {
      await prisma.tag.update({ where: { id }, data });
    }
  } catch {
    return { status: "error", message: POST_FORM_LABELS.slugTaken };
  }

  revalidateTaxonomy(kind === "category" ? "categories" : "tags");
  redirect(`/dashboard/${kind === "category" ? "categories" : "tags"}`);
}

export async function deleteTaxonomy(
  kind: "category" | "tag",
  id: number,
): Promise<{ ok: boolean }> {
  await requireSession();

  const existing =
    kind === "category"
      ? await prisma.category.findUnique({ where: { id }, select: { image: true } })
      : await prisma.tag.findUnique({ where: { id }, select: { image: true } });
  if (!existing) return { ok: false };

  try {
    if (kind === "category") {
      await prisma.category.delete({ where: { id } });
    } else {
      await prisma.tag.delete({ where: { id } });
    }
  } catch {
    return { ok: false };
  }

  if (existing.image) {
    await deleteImage(existing.image).catch(() => undefined);
  }

  revalidateTaxonomy(kind === "category" ? "categories" : "tags");
  return { ok: true };
}

export async function uploadImageAction(
  file: File,
): Promise<{
  ok: boolean;
  key?: string;
  url?: string;
  error?: "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE" | "UPLOAD_FAILED";
}> {
  await requireSession();

  try {
    const key = await uploadImage(file);
    return { ok: true, key, url: r2PublicUrl(key) };
  } catch (error) {
    const code = error instanceof Error ? error.message : "UPLOAD_FAILED";
    if (
      code === "UNSUPPORTED_TYPE" ||
      code === "FILE_TOO_LARGE" ||
      code === "UPLOAD_FAILED"
    ) {
      return { ok: false, error: code };
    }
    return { ok: false, error: "UPLOAD_FAILED" };
  }
}
