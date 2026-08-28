import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getCategories = cache(async () => {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  } catch {
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    return await prisma.category.findUnique({ where: { slug } });
  } catch {
    return null;
  }
});
