import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getTags = cache(async () => {
  try {
    return await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  } catch {
    return [];
  }
});

export const getTagBySlug = cache(async (slug: string) => {
  try {
    return await prisma.tag.findUnique({ where: { slug } });
  } catch {
    return null;
  }
});
