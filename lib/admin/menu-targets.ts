import { prisma } from "@/lib/prisma";
import type { MenuItemOption } from "@/lib/admin-types";

export interface MenuLinkTargets {
  pages: MenuItemOption[];
  posts: MenuItemOption[];
  categories: MenuItemOption[];
  tags: MenuItemOption[];
}

export async function getMenuItemTargets(): Promise<MenuLinkTargets> {
  try {
    const [pages, posts, categories, tags] = await Promise.all([
      prisma.page.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, status: true } }),
      prisma.post.findMany({
        where: { deletedAt: null },
        orderBy: { title: "asc" },
        select: { id: true, title: true, status: true },
      }),
      prisma.category.findMany({ orderBy: { path: "asc" }, select: { id: true, name: true, path: true, parentId: true } }),
      prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);

    const categoryDepth = new Map<number, number>();
    const byId = new Map(categories.map((category) => [category.id, category]));
    for (const category of categories) {
      let depth = 0;
      let parent = category.parentId !== null ? byId.get(category.parentId) : undefined;
      while (parent) {
        depth += 1;
        parent = parent.parentId !== null ? byId.get(parent.parentId) : undefined;
      }
      categoryDepth.set(category.id, depth);
    }

    return {
      pages: pages.map((page) => ({
        id: page.id,
        name: page.status === "DRAFT" ? `${page.title} (پیش‌نویس)` : page.title,
      })),
      posts: posts.map((post) => ({
        id: post.id,
        name: post.status === "DRAFT" ? `${post.title} (پیش‌نویس)` : post.title,
      })),
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        depth: categoryDepth.get(category.id) ?? 0,
      })),
      tags: tags.map((tag) => ({ id: tag.id, name: tag.name })),
    };
  } catch {
    return { pages: [], posts: [], categories: [], tags: [] };
  }
}
