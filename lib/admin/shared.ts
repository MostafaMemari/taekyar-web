import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { getSession } from "@/lib/auth";
import type { PostFieldErrors, PostInput, PostPublishStatus, TaxonomyInput } from "@/lib/admin-types";
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
  revalidatePath("/dashboard/posts/trash");
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

  let parentId: number | null = null;
  if (input.parentId !== null && input.parentId !== undefined) {
    const parsed = Number(input.parentId);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    parentId = parsed;
  }

  return {
    name,
    slug,
    parentId,
    image: normalizeOptionalText(input.image),
    description: normalizeOptionalText(input.description),
    metaTitle: normalizeOptionalText(input.metaTitle),
    metaDescription: normalizeOptionalText(input.metaDescription),
  };
}

export interface NormalizedPost {
  title: string;
  slug: string;
  excerpt: string | null;
  categoryId: number | null;
  tagIds: number[];
  date: string | null;
  readTimeMinutes: number | null;
  content: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: PostPublishStatus;
}

export type PostValidationResult =
  | { ok: true; data: NormalizedPost }
  | { ok: false; fieldErrors: PostFieldErrors };

export function normalizePostInput(input: PostInput): PostValidationResult {
  const errors: PostFieldErrors = {};

  const title = String(input.title ?? "").trim();
  const slug = String(input.slug ?? "").trim().toLowerCase();
  if (!title) errors.title = POST_FORM_LABELS.titleRequired;
  if (!slug) errors.slug = POST_FORM_LABELS.slugRequired;

  const categoryIdRaw = Number(input.categoryId);
  const categoryId =
    input.categoryId === null || input.categoryId === undefined || String(input.categoryId).trim() === ""
      ? null
      : Number.isInteger(categoryIdRaw) && categoryIdRaw > 0
        ? categoryIdRaw
        : ((errors.categoryId = POST_FORM_LABELS.categoryInvalid), null);

  const tagIds = Array.isArray(input.tagIds)
    ? input.tagIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    : [];

  const readTimeRaw = String(input.readTimeMinutes ?? "").trim();
  let readTimeMinutes: number | null = null;
  if (readTimeRaw !== "") {
    const parsed = Number(readTimeRaw);
    if (Number.isInteger(parsed) && parsed > 0) {
      readTimeMinutes = parsed;
    } else {
      errors.readTimeMinutes = POST_FORM_LABELS.readTimeInvalid;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  const date = String(input.date ?? "").trim();
  const excerpt = String(input.excerpt ?? "").trim();
  const rawContent = String(input.content ?? "").trim();

  return {
    ok: true,
    data: {
      title,
      slug,
      excerpt: excerpt.length > 0 ? excerpt : null,
      categoryId,
      tagIds,
      date: date.length > 0 ? date : null,
      readTimeMinutes,
      content: rawContent.length > 0 ? sanitizePostHtml(rawContent) : null,
      coverImage: normalizeOptionalText(input.coverImage),
      coverImageAlt: normalizeOptionalText(input.coverImageAlt),
      metaTitle: normalizeOptionalText(input.metaTitle),
      metaDescription: normalizeOptionalText(input.metaDescription),
      status: input.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    },
  };
}
