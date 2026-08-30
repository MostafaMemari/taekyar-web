import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { PostComment } from "@/data/blog/comments";

export const getPostComments = cache(
  async (slug: string): Promise<PostComment[]> => {
    try {
      const post = await prisma.post.findFirst({
        where: { slug, status: "PUBLISHED", deletedAt: null },
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
    } catch {
      return [];
    }
  },
);
