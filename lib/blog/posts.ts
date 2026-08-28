import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { BlogCategoryName } from "@/data/blog/categories";
import { parsePostBlocks } from "@/lib/post-content";
import { POST_INCLUDE, toPostRows, toBlogPost } from "./types";
import type { BlogPost, PostWithContent } from "./types";

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: POST_INCLUDE,
    });
    return toPostRows(posts);
  } catch {
    return [];
  }
});

export const getBlogPostsCount = cache(async (category: BlogCategoryName | null): Promise<number> => {
  const where = category ? { category: { name: category } } : {};
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
    const where = category ? { category: { name: category } } : {};
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
      if (!post) return null;
      const blogPost = toBlogPost(post);
      return { ...blogPost, content: parsePostBlocks(post.content) };
    } catch {
      return null;
    }
  },
);

export const getPostsByCategory = cache(
  async (categoryId: number): Promise<BlogPost[]> => {
    try {
      const posts = await prisma.post.findMany({
        where: { categoryId },
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
        where: { tags: { some: { id: tagId } } },
        orderBy: { createdAt: "desc" },
        include: POST_INCLUDE,
      });
      return toPostRows(posts);
    } catch {
      return [];
    }
  },
);
