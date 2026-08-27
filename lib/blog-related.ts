import type { BlogPost } from "@/data/blog/posts";

export function getRelatedPosts(
  posts: BlogPost[],
  currentSlug: string,
  category: string,
  count: number
) {
  const candidates = posts.filter((post) => post.slug !== currentSlug);
  const sameCategory = candidates.filter((post) => post.category === category);
  const others = candidates.filter((post) => post.category !== category);

  return [...sameCategory, ...others].slice(0, count);
}
