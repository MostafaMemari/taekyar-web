import { ADMIN_BAR_LABELS } from "@/data/layout/admin-bar";
import { getPostBySlug, getTagBySlug, resolveCategoryPath } from "@/lib/blog";
import { categoryEditHref, postEditHref, tagEditHref } from "@/lib/routes";

export interface AdminBarEdit {
  href: string;
  label: string;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export async function resolveAdminBarEditContext(pathname: string): Promise<AdminBarEdit | null> {
  if (!pathname.startsWith("/blog/") || pathname === "/blog/") return null;

  const rest = decodeSegment(pathname.slice("/blog/".length));

  if (rest.startsWith("category/")) {
    const resolved = await resolveCategoryPath(rest.slice("category/".length).split("/").map(decodeSegment));
    return resolved.status === "found"
      ? { href: categoryEditHref(resolved.category.id), label: ADMIN_BAR_LABELS.editCategory }
      : null;
  }

  if (rest.startsWith("tag/")) {
    const tag = await getTagBySlug(decodeSegment(rest.slice("tag/".length)));
    return tag ? { href: tagEditHref(tag.id), label: ADMIN_BAR_LABELS.editTag } : null;
  }

  if (rest.includes("/")) return null;

  const post = await getPostBySlug(rest);
  return post ? { href: postEditHref(post.slug), label: ADMIN_BAR_LABELS.editPost } : null;
}
