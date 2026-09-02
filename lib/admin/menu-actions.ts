"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { MENUS_LABELS } from "@/data/dashboard/ui";
import type {
  MenuItemFieldErrors,
  MenuItemFormState,
  MenuItemInput,
} from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { requireSession } from "./shared";

function revalidateMenus() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/dashboard/menus");
  revalidateTag("menus", "max");
}

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

export async function createMenuItem(input: MenuItemInput): Promise<MenuItemFormState> {
  await requireSession();

  const title = String(input.title ?? "").trim();
  if (!title) return { status: "error", fieldErrors: { title: MENUS_LABELS.titleRequired } };
  const fieldErrors = targetFieldErrors(input);
  if (fieldErrors) return { status: "error", fieldErrors };

  const parent = input.parentId
    ? await prisma.menuItem.findUnique({
        where: { id: input.parentId },
        select: { id: true, parentId: true, location: true },
      })
    : null;
  if (input.parentId && !parent) return { status: "error", fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
  if (parent) {
    if (parent.location !== input.location) return { status: "error", fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
    if (parent.parentId !== null) return { status: "error", fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
  }

  const lastSibling = await prisma.menuItem.findFirst({
    where: { location: input.location, parentId: input.parentId ?? null },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.menuItem.create({
    data: { ...normalizedData(input, title), parentId: input.parentId ?? null, location: input.location, order: (lastSibling?.order ?? -1) + 1 },
  });

  revalidateMenus();
  return { status: "idle" };
}

export async function updateMenuItem(id: number, input: MenuItemInput): Promise<MenuItemFormState> {
  await requireSession();

  const title = String(input.title ?? "").trim();
  if (!title) return { status: "error", fieldErrors: { title: MENUS_LABELS.titleRequired } };
  const fieldErrors = targetFieldErrors(input);
  if (fieldErrors) return { status: "error", fieldErrors };

  const existing = await prisma.menuItem.findUnique({ where: { id }, select: { id: true, location: true, parentId: true } });
  if (!existing) return { status: "error", message: MENUS_LABELS.saveError };

  if (input.parentId !== null && input.parentId !== existing.parentId) {
    const parent = await prisma.menuItem.findUnique({
      where: { id: input.parentId },
      select: { id: true, parentId: true, location: true },
    });
    if (!parent || parent.location !== existing.location || parent.parentId !== null) {
      return { status: "error", fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
    }
    if (parent.id === id) return { status: "error", fieldErrors: { parentId: MENUS_LABELS.maxDepth } };
  }

  await prisma.menuItem.update({
    where: { id },
    data: { ...normalizedData(input, title), parentId: input.parentId },
  });

  revalidateMenus();
  return { status: "idle" };
}

export async function deleteMenuItem(id: number): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    await prisma.menuItem.delete({ where: { id } });
  } catch {
    return { ok: false };
  }

  revalidateMenus();
  return { ok: true };
}

export async function moveMenuItem(id: number, direction: "up" | "down"): Promise<{ ok: boolean }> {
  await requireSession();

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

  revalidateMenus();
  return { ok: true };
}
