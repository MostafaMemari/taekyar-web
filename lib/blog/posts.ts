import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { BlogCategoryName } from "@/data/blog/categories";
import type { PostPublishStatus } from "@/lib/admin-types";
import { parsePostHtml } from "@/lib/post-content";
import { POST_INCLUDE, toPostRows, toBlogPost } from "./types";
import type { BlogPost, PostWithContent } from "./types";

export const PUBLIC_POST_WHERE = { status: "PUBLISHED", deletedAt: null } as const;

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const posts = await prisma.post.findMany({
      where: PUBLIC_POST_WHERE,
      orderBy: { createdAt: "desc" },
      include: POST_INCLUDE,
    });
    return toPostRows(posts);
  } catch {
    return [];
  }
});

export const getBlogPostsCount = cache(async (category: BlogCategoryName | null): Promise<number> => {
  const where = category ? { ...PUBLIC_POST_WHERE, categories: { some: { name: category } } } : PUBLIC_POST_WHERE;
  try {
    return await prisma.post.count({ where });
  } catch {
    return 0;
  }
});

export const getPaginatedBlogPosts = cache(
  async ({
    category,
    page,
    perPage,
  }: {
    category: BlogCategoryName | null;
    page: number;
    perPage: number;
  }): Promise<{ posts: BlogPost[]; totalCount: number }> => {
    const where = category ? { ...PUBLIC_POST_WHERE, categories: { some: { name: category } } } : PUBLIC_POST_WHERE;
    try {
      const [totalCount, posts] = await Promise.all([
        prisma.post.count({ where }),
        prisma.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: POST_INCLUDE,
          skip: (page - 1) * perPage,
          take: perPage,
        }),
      ]);
      return { posts: toPostRows(posts), totalCount };
    } catch {
      return { posts: [], totalCount: 0 };
    }
  },
);

export const getPostBySlug = cache(
  async (slug: string): Promise<PostWithContent | null> => {
    try {
      const post = await prisma.post.findUnique({
        where: { slug },
        include: POST_INCLUDE,
      });
      if (!post || post.status !== "PUBLISHED" || post.deletedAt) return null;
      const blogPost = toBlogPost(post);
      return { ...blogPost, content: parsePostHtml(post.content) };
    } catch {
      return null;
    }
  },
);

export const getPostBySlugForAdmin = cache(
  async (
    slug: string,
  ): Promise<(PostWithContent & { status: PostPublishStatus }) | null> => {
    try {
      const post = await prisma.post.findUnique({
        where: { slug },
        include: POST_INCLUDE,
      });
      if (!post || post.deletedAt) return null;
      const blogPost = toBlogPost(post);
      return { ...blogPost, status: post.status, content: parsePostHtml(post.content) };
    } catch {
      return null;
    }
  },
);

export const getPostsByCategory = cache(
  async (category: { id: number; path: string }): Promise<BlogPost[]> => {
    try {
      const descendants = await prisma.category.findMany({
        where: { path: { startsWith: `${category.path}/` } },
        select: { id: true },
      });
      const posts = await prisma.post.findMany({
        where: {
          ...PUBLIC_POST_WHERE,
          categories: { some: { id: { in: [category.id, ...descendants.map((descendant) => descendant.id)] } } },
        },
        orderBy: { createdAt: "desc" },
        include: POST_INCLUDE,
      });
      return toPostRows(posts);
    } catch {
      return [];
    }
  },
);

export const getPostsByTag = cache(
  async (tagId: number): Promise<BlogPost[]> => {
    try {
      const posts = await prisma.post.findMany({
        where: { ...PUBLIC_POST_WHERE, tags: { some: { id: tagId } } },
        orderBy: { createdAt: "desc" },
        include: POST_INCLUDE,
      });
      return toPostRows(posts);
    } catch {
      return [];
    }
  },
);
