import { MENUS_LABELS } from "@/data/dashboard/ui";
import type {
  MenuItemFieldErrors,
  MenuItemInput,
  MenuItemMutationResult,
  MenuLinkTargets,
} from "@/types/api";
import { prisma } from "@/server/config/prisma";

function targetFieldErrors(input: MenuItemInput): MenuItemFieldErrors | null {
  if (input.type === "CUSTOM") {
    const url = String(input.customUrl ?? "").trim();
    if (!url) return { target: MENUS_LABELS.targetRequired };
    return null;
  }
  const referenceId =
    input.type === "PAGE"
      ? input.pageId
      : input.type === "POST"
        ? input.postId
        : input.type === "CATEGORY"
          ? input.categoryId
          : input.tagId;
  if (!Number.isInteger(referenceId) || Number(referenceId) <= 0) {
    return { target: MENUS_LABELS.targetRequired };
  }
  return null;
}

function normalizedData(input: MenuItemInput, title: string) {
  return {
    title,
    type: input.type,
    customUrl: input.type === "CUSTOM" ? String(input.customUrl ?? "").trim() : null,
    pageId: input.type === "PAGE" ? input.pageId : null,
    postId: input.type === "POST" ? input.postId : null,
    categoryId: input.type === "CATEGORY" ? input.categoryId : null,
    tagId: input.type === "TAG" ? input.tagId : null,
  };
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItemMutationResult> {
  const title = String(input.title ?? "").trim();
  if (!title) return { ok: false, fieldErrors: { title: MENUS_LABELS.titleRequired } };
  const fieldErrors = targetFieldErrors(input);
  if (fieldErrors) return { ok: false, fieldErrors };

  const parent = input.parentId
    ? await prisma.menuItem.findUnique({
        where: { id: input.parentId },
        select: { id: true, parentId: true, location: true },
      })
    : null;
  if (input.parentId && !parent) return { ok: false, fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
  if (parent) {
    if (parent.location !== input.location) return { ok: false, fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
    if (parent.parentId !== null) return { ok: false, fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
  }

  const lastSibling = await prisma.menuItem.findFirst({
    where: { location: input.location, parentId: input.parentId ?? null },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.menuItem.create({
    data: { ...normalizedData(input, title), parentId: input.parentId ?? null, location: input.location, order: (lastSibling?.order ?? -1) + 1 },
  });

  return { ok: true };
}

export async function updateMenuItem(id: number, input: MenuItemInput): Promise<MenuItemMutationResult> {
  const title = String(input.title ?? "").trim();
  if (!title) return { ok: false, fieldErrors: { title: MENUS_LABELS.titleRequired } };
  const fieldErrors = targetFieldErrors(input);
  if (fieldErrors) return { ok: false, fieldErrors };

  const existing = await prisma.menuItem.findUnique({ where: { id }, select: { id: true, location: true, parentId: true } });
  if (!existing) return { ok: false, message: MENUS_LABELS.saveError };

  if (input.parentId !== null && input.parentId !== existing.parentId) {
    const parent = await prisma.menuItem.findUnique({
      where: { id: input.parentId },
      select: { id: true, parentId: true, location: true },
    });
    if (!parent || parent.location !== existing.location || parent.parentId !== null) {
      return { ok: false, fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
    }
    if (parent.id === id) return { ok: false, fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
  }

  await prisma.menuItem.update({
    where: { id },
    data: { ...normalizedData(input, title), parentId: input.parentId },
  });

  return { ok: true };
}

export async function deleteMenuItem(id: number): Promise<{ ok: boolean }> {
  try {
    await prisma.menuItem.delete({ where: { id } });
  } catch {
    return { ok: false };
  }

  return { ok: true };
}

export async function moveMenuItem(id: number, direction: "up" | "down"): Promise<{ ok: boolean }> {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    select: { id: true, location: true, parentId: true, order: true },
  });
  if (!item) return { ok: false };

  const siblings = await prisma.menuItem.findMany({
    where: { location: item.location, parentId: item.parentId },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  const index = siblings.findIndex((sibling) => sibling.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= siblings.length) return { ok: false };

  const reordered = [...siblings];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, moved);

  await prisma.$transaction(
    reordered.map((sibling, order) =>
      prisma.menuItem.update({ where: { id: sibling.id }, data: { order } }),
    ),
  );

  return { ok: true };
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
