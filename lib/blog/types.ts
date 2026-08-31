export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  categoryId: number | null;
  category: string | null;
  categoryPath: string | null;
  categoryImage: string | null;
  tags: Array<{ id: number; name: string; slug: string }>;
  date: string | null;
  readTimeMinutes: number | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
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
  date: string | null;
  readTimeMinutes: number | null;
  content?: unknown;
  coverImage: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: { id: number; name: string; slug: string; path: string; image: string | null } | null;
  tags: Array<{ id: number; name: string; slug: string }>;
}

export function toBlogPost(post: BlogPostRow): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categoryId: post.category?.id ?? null,
    category: post.category?.name ?? null,
    categoryPath: post.category?.path ?? null,
    categoryImage: post.category?.image ?? null,
    tags: post.tags,
    date: post.date,
    readTimeMinutes: post.readTimeMinutes,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export const POST_INCLUDE = { category: true, tags: true } as const;

export function toPostRows(posts: Array<BlogPostRow & { content?: unknown }>): BlogPost[] {
  return posts.map(toBlogPost);
}
