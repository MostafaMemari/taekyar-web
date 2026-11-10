import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { categoryHref, pageHref, postHref, tagHref } from "@/lib/routes";

export type MenuLocation = "HEADER_DESKTOP" | "HEADER_MOBILE" | "FOOTER_QUICK" | "FOOTER_BLOG";

export interface MenuItemNode {
  id: number;
  title: string;
  href: string;
  children: MenuItemNode[];
}

const ITEM_SELECT = {
  id: true,
  title: true,
  type: true,
  customUrl: true,
  order: true,
  parentId: true,
  page: { select: { slug: true, status: true } },
  post: { select: { slug: true, status: true, deletedAt: true } },
  category: { select: { path: true } },
  tag: { select: { slug: true } },
} as const;

type MenuItemRow = {
  id: number;
  title: string;
  type: "PAGE" | "POST" | "CATEGORY" | "TAG" | "CUSTOM";
  customUrl: string | null;
  order: number;
  parentId: number | null;
  page: { slug: string; status: "DRAFT" | "PUBLISHED" } | null;
  post: { slug: string; status: "DRAFT" | "PUBLISHED"; deletedAt: Date | null } | null;
  category: { path: string } | null;
  tag: { slug: string } | null;
};

function resolveHref(item: MenuItemRow): string | null {
  switch (item.type) {
    case "PAGE":
      return item.page && item.page.status === "PUBLISHED" ? pageHref(item.page.slug) : null;
    case "POST":
      return item.post && item.post.status === "PUBLISHED" && !item.post.deletedAt
        ? postHref(item.post.slug)
        : null;
    case "CATEGORY":
      return item.category ? categoryHref(item.category.path) : null;
    case "TAG":
      return item.tag ? tagHref(item.tag.slug) : null;
    case "CUSTOM":
      return item.customUrl ?? null;
  }
}

function buildMenuTree(rows: MenuItemRow[]): MenuItemNode[] {
  const nodesById = new Map<number, MenuItemNode>();
  const roots: MenuItemNode[] = [];

  for (const row of rows) {
    const href = resolveHref(row);
    if (!href) continue;
    nodesById.set(row.id, { id: row.id, title: row.title, href, children: [] });
  }

  for (const row of rows) {
    const node = nodesById.get(row.id);
    if (!node) continue;
    const parent = row.parentId !== null ? nodesById.get(row.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  return roots;
}

export const getMenuTree = cache(async (location: MenuLocation): Promise<MenuItemNode[]> => {
  try {
    const rows = await prisma.menuItem.findMany({
      where: { location },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: ITEM_SELECT,
    });
    return buildMenuTree(rows as MenuItemRow[]);
  } catch {
    return [];
  }
});
