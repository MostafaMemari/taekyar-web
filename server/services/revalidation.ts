import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePostPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
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

export function revalidatePagePaths(slug: string) {
  revalidatePath("/");
  revalidatePath(`/dashboard/pages`);
  revalidateTag("pages", "max");
  revalidateTag(`page-${slug}`, "max");
}

export function revalidateFaqPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/dashboard/faqs");
  revalidatePath("/dashboard");
  revalidateTag("faqs", "max");
  if (slug) {
    revalidatePostPaths(slug);
    revalidatePath(`/dashboard/posts/${slug}/edit`);
  }
}

export function revalidateMenus() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/dashboard/menus");
  revalidateTag("menus", "max");
}

export function revalidateSettings() {
  revalidatePath("/", "layout");
}
