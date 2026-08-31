import type { BlogPost } from "@/lib/blog";

export function getRelatedPosts(
  posts: BlogPost[],
  currentSlug: string,
  category: string | null,
  count: number
) {
  const candidates = posts.filter((post) => post.slug !== currentSlug);
  if (!category) return candidates.slice(0, count);

  const sameCategory = candidates.filter((post) => post.category === category);
  const others = candidates.filter((post) => post.category !== category);

  return [...sameCategory, ...others].slice(0, count);
}
