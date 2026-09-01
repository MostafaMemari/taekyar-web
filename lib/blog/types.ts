import type { SeoOverrides } from "@/lib/seo";

export interface PostCategoryRef {
  id: number;
  name: string;
  slug: string;
  path: string;
  image: string | null;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  categories: PostCategoryRef[];
  category: string | null;
  categoryPath: string | null;
  categoryImage: string | null;
  tags: Array<{ id: number; name: string; slug: string }>;
  date: Date | null;
  readTimeMinutes: number | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  seo: SeoOverrides | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithContent extends BlogPost {
  content: string;
}

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  date: Date | null;
  readTimeMinutes: number | null;
  content?: unknown;
  coverImage: string | null;
  coverImageAlt: string | null;
  seo: SeoOverrides | null;
  createdAt: Date;
  updatedAt: Date;
  categories: PostCategoryRef[];
  tags: Array<{ id: number; name: string; slug: string }>;
}

export function toBlogPost(post: BlogPostRow): BlogPost {
  const categories = [...post.categories].sort((a, b) => a.id - b.id);
  const primaryCategory = categories[0] ?? null;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categories,
    category: primaryCategory?.name ?? null,
    categoryPath: primaryCategory?.path ?? null,
    categoryImage: primaryCategory?.image ?? null,
    tags: post.tags,
    date: post.date,
    readTimeMinutes: post.readTimeMinutes,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    seo: post.seo,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export const POST_INCLUDE = { categories: true, tags: true, seo: true } as const;

export function toPostRows(posts: Array<BlogPostRow & { content?: unknown }>): BlogPost[] {
  return posts.map(toBlogPost);
}
