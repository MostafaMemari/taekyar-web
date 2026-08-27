"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { endSession, getSession, startSession } from "@/lib/auth";
import type { LoginState, PostFormState, PostInput } from "@/lib/admin-types";
import { blogCategories } from "@/data/blog/categories";
import { prisma } from "@/lib/prisma";
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

function normalizePostInput(input: PostInput): PostInput | null {
  const title = String(input.title ?? "").trim();
  const slug = String(input.slug ?? "").trim().toLowerCase();
  const excerpt = String(input.excerpt ?? "").trim();
  const category = String(input.category ?? "");
  const date = String(input.date ?? "").trim();
  const readTimeMinutes = Number(input.readTimeMinutes);
  const tags = Array.isArray(input.tags)
    ? input.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : [];

  if (!title || !slug || !excerpt || !date) return null;
  if (!(blogCategories as string[]).includes(category)) return null;
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

  return { title, slug, excerpt, category, tags, date, readTimeMinutes, content };
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
    await prisma.post.create({ data: { ...data, tags: data.tags } });
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
    await prisma.post.update({ where: { slug: currentSlug }, data });
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
