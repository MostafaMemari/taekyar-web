import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { PostBlock } from "@/lib/post-content";
import type { PostInput, TaxonomyInput } from "@/lib/admin-types";

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export function revalidatePostPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard/comments");
  revalidateTag("blog", "max");
  revalidateTag("posts", "max");
  revalidateTag(`post-${slug}`, "max");
}

export function revalidateTaxonomy(kind: "categories" | "tags") {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/dashboard/${kind}`);
  revalidatePath("/dashboard");
  revalidateTag("blog", "max");
  revalidateTag(kind, "max");
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

export function normalizeContentBlock(raw: unknown): PostBlock | null {
  const block = raw as Record<string, unknown>;
  const type = typeof block.type === "string" ? block.type : "";
  const text = String(block.text ?? "").trim();

  switch (type) {
    case "list":
      return {
        type: "list",
        ordered: block.ordered === true,
        items: (Array.isArray(block.items) ? block.items : [])
          .map((item) => String(item).trim())
          .filter(Boolean),
      };
    case "heading": {
      const level = Number(block.level);
      const safeLevel = ([1, 2, 3, 4] as const).includes(level as 1) ? (level as 1 | 2 | 3 | 4) : 2;
      return { type: "heading", level: safeLevel, text };
    }
    case "image": {
      const src = String(block.src ?? "").trim();
      if (!src) return null;
      return {
        type: "image",
        src,
        alt: String(block.alt ?? "").trim(),
        caption: String(block.caption ?? "").trim() || null,
      };
    }
    case "divider":
      return { type: "divider" };
    case "paragraph":
    case "quote":
    case "tip":
    case "warning":
      return { type, text };
    default:
      return null;
  }
}

function isNonEmptyBlock(block: PostBlock): boolean {
  if (block.type === "list") return block.items.length > 0;
  if (block.type === "divider" || block.type === "image") return true;
  return block.text.length > 0;
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

  const content = Array.isArray(input.content)
    ? input.content
        .map(normalizeContentBlock)
        .filter((block): block is PostBlock => block !== null && isNonEmptyBlock(block))
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
