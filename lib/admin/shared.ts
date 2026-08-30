import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { PostInput, TaxonomyInput } from "@/lib/admin-types";
import { postHref } from "@/lib/routes";
import { sanitizePostHtml } from "@/lib/post-content";

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export function revalidatePostPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(postHref(slug));
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard/comments");
  revalidateTag("blog", "max");
  revalidateTag("posts", "max");
  revalidateTag(`post-${slug}`, "max");
}

export function revalidateCommentTargets(slug: string) {
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard/comments");
  revalidatePath("/dashboard");
  revalidateTag("blog", "max");
  revalidateTag("comments", "max");
}

export function revalidateTaxonomy(kind: "categories" | "tags") {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/dashboard/${kind}`);
  revalidatePath("/dashboard");
  revalidateTag("blog", "max");
  revalidateTag(kind, "max");
}

export function revalidateMedia() {
  revalidatePath("/dashboard/media");
  revalidatePath("/dashboard");
}

export function normalizeOptionalText(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

export function normalizeTaxonomyInput(input: TaxonomyInput): TaxonomyInput | null {
  const name = String(input.name ?? "").trim();
  const slug = String(input.slug ?? "").trim().toLowerCase();
  if (!name || !slug) return null;
  return {
    name,
    slug,
    image: normalizeOptionalText(input.image),
    description: normalizeOptionalText(input.description),
    metaTitle: normalizeOptionalText(input.metaTitle),
    metaDescription: normalizeOptionalText(input.metaDescription),
  };
}

export function normalizePostInput(input: PostInput): PostInput | null {
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

  const content = sanitizePostHtml(String(input.content ?? "").trim());
  if (!content) return null;

  return {
    title,
    slug,
    excerpt,
    categoryId,
    tagIds,
    date,
    readTimeMinutes,
    content,
    coverImage: normalizeOptionalText(input.coverImage),
    coverImageAlt: normalizeOptionalText(input.coverImageAlt),
    metaTitle: normalizeOptionalText(input.metaTitle),
    metaDescription: normalizeOptionalText(input.metaDescription),
  };
}
