import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { PostComment } from "@/data/blog/comments";
import { blogCategories, type BlogCategoryName } from "@/data/blog/categories";
import type { PostBlock } from "@/lib/post-content";

export { blogCategories, type BlogCategoryName };

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryName;
  tags: string[];
  date: string;
  readTimeMinutes: number;
}

export interface PostWithContent extends BlogPost {
  content: PostBlock[];
}

function toCategory(value: string): BlogCategoryName | null {
  return (blogCategories as string[]).includes(value)
    ? (value as BlogCategoryName)
    : null;
}

function toBlogPost(post: {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTimeMinutes: number;
}): BlogPost | null {
  const category = toCategory(post.category);
  if (!category) return null;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category,
    tags: post.tags,
    date: post.date,
    readTimeMinutes: post.readTimeMinutes,
  };
}

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return posts
    .map(toBlogPost)
    .filter((post): post is BlogPost => post !== null);
});

export const getPostBySlug = cache(
  async (slug: string): Promise<PostWithContent | null> => {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return null;

    const blogPost = toBlogPost(post);
    if (!blogPost) return null;

    return { ...blogPost, content: (post.content as PostBlock[]) ?? [] };
  },
);

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
