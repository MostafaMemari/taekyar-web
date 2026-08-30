import { cache } from "react";
import type { Category } from "@prisma/client";

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

export interface PublicCategoryNode {
  id: number;
  name: string;
  path: string;
  image: string | null;
  postCount: number;
  children: PublicCategoryNode[];
}

export const getCategoryTree = cache(async (): Promise<PublicCategoryNode[]> => {
  try {
    const rows = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });

    const rowById = new Map(rows.map((row) => [row.id, row]));
    const postCounts = new Map(rows.map((row) => [row.id, row._count.posts]));

    for (const row of rows) {
      let parent = row.parentId !== null ? rowById.get(row.parentId) : undefined;
      while (parent) {
        postCounts.set(parent.id, (postCounts.get(parent.id) ?? 0) + row._count.posts);
        const nextId = parent.parentId;
        parent = nextId !== null ? rowById.get(nextId) : undefined;
      }
    }

    const nodeById = new Map<number, PublicCategoryNode>();
    for (const row of rows) {
      nodeById.set(row.id, {
        id: row.id,
        name: row.name,
        path: row.path,
        image: row.image,
        postCount: postCounts.get(row.id) ?? row._count.posts,
        children: [],
      });
    }

    const roots: PublicCategoryNode[] = [];
    for (const row of rows) {
      const node = nodeById.get(row.id);
      if (!node) continue;
      const parent = row.parentId !== null ? nodeById.get(row.parentId) : undefined;
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    const sortRecursively = (list: PublicCategoryNode[]) => {
      list.sort((a, b) => a.name.localeCompare(b.name, "fa"));
      for (const node of list) sortRecursively(node.children);
    };
    sortRecursively(roots);

    return roots;
  } catch {
    return [];
  }
});

export function flattenPublicCategoryTree(
  nodes: PublicCategoryNode[],
): Array<{ item: PublicCategoryNode; depth: number }> {
  const result: Array<{ item: PublicCategoryNode; depth: number }> = [];
  const visit = (list: PublicCategoryNode[], depth: number) => {
    for (const node of list) {
      result.push({ item: node, depth });
      visit(node.children, depth + 1);
    }
  };
  visit(nodes, 0);
  return result;
}

interface HierarchicalRow {
  id: number;
  name: string;
  parentId: number | null;
}

export interface CategoryTreeNode<T> {
  item: T;
  children: CategoryTreeNode<T>[];
}

export function buildCategoryTree<T extends HierarchicalRow>(rows: T[]): CategoryTreeNode<T>[] {
  const nodes = new Map<number, CategoryTreeNode<T>>();
  for (const row of rows) nodes.set(row.id, { item: row, children: [] });

  const roots: CategoryTreeNode<T>[] = [];
  for (const node of nodes.values()) {
    const parent =
      node.item.parentId !== null ? nodes.get(node.item.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRecursively = (list: CategoryTreeNode<T>[]) => {
    list.sort((a, b) => a.item.name.localeCompare(b.item.name, "fa"));
    for (const node of list) sortRecursively(node.children);
  };
  sortRecursively(roots);

  return roots;
}

export function flattenCategoryTree<T>(
  nodes: CategoryTreeNode<T>[],
): Array<{ item: T; depth: number }> {
  const result: Array<{ item: T; depth: number }> = [];
  const visit = (list: CategoryTreeNode<T>[], depth: number) => {
    for (const node of list) {
      result.push({ item: node.item, depth });
      visit(node.children, depth + 1);
    }
  };
  visit(nodes, 0);
  return result;
}

export function filterCategoryRowsWithAncestors<T extends HierarchicalRow & { slug: string }>(
  rows: T[],
  query: string,
): T[] {
  const normalized = query.trim();
  if (!normalized) return rows;

  const rowsById = new Map(rows.map((row) => [row.id, row]));
  const keep = new Set<number>();

  for (const row of rows) {
    if (row.name.includes(normalized) || row.slug.includes(normalized.toLowerCase())) {
      let current: T | undefined = row;
      while (current && !keep.has(current.id)) {
        keep.add(current.id);
        current = current.parentId !== null ? rowsById.get(current.parentId) : undefined;
      }
    }
  }

  return rows.filter((row) => keep.has(row.id));
}

export function toCategorySelectOptions(
  rows: Array<{ id: number; name: string; parentId: number | null }>,
): Array<{ id: number; name: string; depth: number }> {
  return flattenCategoryTree(buildCategoryTree(rows)).map(({ item, depth }) => ({
    id: item.id,
    name: item.name,
    depth,
  }));
}

export const getCategoryAncestorsByPath = cache(async (path: string): Promise<Category[]> => {
  const segments = path.split("/");
  if (segments.length < 2) return [];

  const prefixes = segments
    .slice(0, -1)
    .map((_, index) => segments.slice(0, index + 1).join("/"));

  try {
    return await prisma.category.findMany({
      where: { path: { in: prefixes } },
      orderBy: { path: "asc" },
    });
  } catch {
    return [];
  }
});

export type ResolvedCategoryPath =
  | { status: "found"; category: Category; ancestors: Category[] }
  | { status: "redirect"; category: Category }
  | { status: "missing" };

export const resolveCategoryPath = cache(async (segments: string[]): Promise<ResolvedCategoryPath> => {
  const path = segments.filter(Boolean).join("/");
  if (!path) return { status: "missing" };

  try {
    const category = await prisma.category.findUnique({ where: { path } });
    if (category) {
      const ancestors = await getCategoryAncestorsByPath(category.path);
      return { status: "found", category, ancestors };
    }

    const bySlug = await prisma.category.findUnique({
      where: { slug: segments[segments.length - 1] },
    });
    if (bySlug) return { status: "redirect", category: bySlug };

    return { status: "missing" };
  } catch {
    return { status: "missing" };
  }
});
