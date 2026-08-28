import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { PostComment } from "@/data/blog/comments";
import type { BlogCategoryName } from "@/data/blog/categories";
import type { PostBlock } from "@/lib/post-content";

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
  content: PostBlock[];
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

const POST_INCLUDE = { category: true, tags: true } as const;

function toPostRows(
  posts: Array<BlogPostRow & { content?: unknown }>,
): BlogPost[] {
  return posts.map(toBlogPost);
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: POST_INCLUDE,
  });
  return toPostRows(posts);
});

export const getPostBySlug = cache(
  async (slug: string): Promise<PostWithContent | null> => {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: POST_INCLUDE,
    });
    if (!post) return null;

    const blogPost = toBlogPost(post);
    return { ...blogPost, content: (post.content as PostBlock[]) ?? [] };
  },
);

export const getPostsByCategory = cache(
  async (categoryId: number): Promise<BlogPost[]> => {
    const posts = await prisma.post.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
      include: POST_INCLUDE,
    });
    return toPostRows(posts);
  },
);

export const getPostsByTag = cache(
  async (tagId: number): Promise<BlogPost[]> => {
    const posts = await prisma.post.findMany({
      where: { tags: { some: { id: tagId } } },
      orderBy: { createdAt: "desc" },
      include: POST_INCLUDE,
    });
    return toPostRows(posts);
  },
);

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({ where: { slug } });
});

export const getTags = cache(async () => {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
});

export const getTagBySlug = cache(async (slug: string) => {
  return prisma.tag.findUnique({ where: { slug } });
});

export const getPostComments = cache(
  async (slug: string): Promise<PostComment[]> => {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) return [];

    const comments = await prisma.comment.findMany({
      where: { postId: post.id, parentId: null, status: "APPROVED" },
      orderBy: { createdAt: "asc" },
      include: {
        replies: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      author: comment.author,
      role: comment.role,
      isTeamAuthor: comment.isTeamAuthor,
      date: comment.date,
      message: comment.message,
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        author: reply.author,
        role: reply.role,
        isTeamAuthor: reply.isTeamAuthor,
        date: reply.date,
        message: reply.message,
      })),
    }));
  },
);
