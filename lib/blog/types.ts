import type { BlogCategoryName } from "@/data/blog/categories";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: number;
  category: BlogCategoryName;
  categorySlug: string;
  tags: Array<{ id: number; name: string; slug: string }>;
  date: string;
  readTimeMinutes: number;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface PostWithContent extends BlogPost {
  content: string;
}

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTimeMinutes: number;
  content?: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  category: { id: number; name: string; slug: string; image: string | null };
  tags: Array<{ id: number; name: string; slug: string }>;
}

export function toBlogPost(post: BlogPostRow): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categoryId: post.category.id,
    category: post.category.name as BlogCategoryName,
    categorySlug: post.category.slug,
    tags: post.tags,
    date: post.date,
    readTimeMinutes: post.readTimeMinutes,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  };
}

export const POST_INCLUDE = { category: true, tags: true } as const;

export function toPostRows(posts: Array<BlogPostRow & { content?: unknown }>): BlogPost[] {
  return posts.map(toBlogPost);
}
