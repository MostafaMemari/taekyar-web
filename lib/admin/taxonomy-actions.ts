"use server";

import { redirect } from "next/navigation";
import { POST_FORM_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { PostFormState, TaxonomyInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/r2";
import { normalizeTaxonomyInput, requireSession, revalidateTaxonomy } from "./shared";

function toTagData(data: TaxonomyInput) {
  return {
    name: data.name,
    slug: data.slug,
    image: data.image,
    imageAlt: data.imageAlt,
    description: data.description,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
  };
}

async function saveCategory(id: number | null, data: TaxonomyInput): Promise<string | null> {
  const parentId = data.parentId;
  let parent: { id: number; path: string } | null = null;
  if (parentId !== null) {
    parent = await prisma.category.findUnique({
      where: { id: parentId },
      select: { id: true, path: true },
    });
    if (!parent) return TAXONOMY_LABELS.parentInvalid;
  }

  if (id === null) {
    const path = parent ? `${parent.path}/${data.slug}` : data.slug;
    await prisma.category.create({ data: { ...data, path } });
    return null;
  }

  const existing = await prisma.category.findUnique({ where: { id }, select: { path: true } });
  if (!existing) return TAXONOMY_LABELS.parentInvalid;

  if (parent && (parent.id === id || parent.path.startsWith(`${existing.path}/`))) {
    return TAXONOMY_LABELS.parentCycle;
  }

  const newPath = parent ? `${parent.path}/${data.slug}` : data.slug;

  if (newPath === existing.path) {
    await prisma.category.update({ where: { id }, data });
    return null;
  }

  const descendants = await prisma.category.findMany({
    where: { path: { startsWith: `${existing.path}/` } },
    select: { id: true, path: true },
  });

  await prisma.$transaction([
    prisma.category.update({ where: { id }, data: { ...data, path: newPath } }),
    ...descendants.map((descendant) =>
      prisma.category.update({
        where: { id: descendant.id },
        data: { path: `${newPath}${descendant.path.slice(existing.path.length)}` },
      }),
    ),
  ]);

  return null;
}

export async function saveTaxonomy(
  kind: "category" | "tag",
  id: number | null,
  input: TaxonomyInput,
): Promise<PostFormState> {
  await requireSession();

  const data = normalizeTaxonomyInput(input);
  if (!data) return { status: "error", message: POST_FORM_LABELS.error };

  try {
    if (kind === "category") {
      const categoryError = await saveCategory(id, data);
      if (categoryError) return { status: "error", message: categoryError };
    } else if (id === null) {
      await prisma.tag.create({ data: toTagData(data) });
    } else {
      await prisma.tag.update({ where: { id }, data: toTagData(data) });
    }
  } catch {
    return { status: "error", message: POST_FORM_LABELS.slugTaken };
  }

  revalidateTaxonomy(kind === "category" ? "categories" : "tags");
  redirect(`/dashboard/${kind === "category" ? "categories" : "tags"}`);
}

export async function deleteTaxonomy(
  kind: "category" | "tag",
  id: number,
): Promise<{ ok: boolean; reason?: "hasChildren" | "hasPosts" }> {
  await requireSession();

  const existing =
    kind === "category"
      ? await prisma.category.findUnique({ where: { id }, select: { image: true } })
      : await prisma.tag.findUnique({ where: { id }, select: { image: true } });
  if (!existing) return { ok: false };

  try {
    if (kind === "category") {
      const [childCount, postCount] = await Promise.all([
        prisma.category.count({ where: { parentId: id } }),
        prisma.post.count({ where: { categories: { some: { id } } } }),
      ]);
      if (childCount > 0) return { ok: false, reason: "hasChildren" };
      if (postCount > 0) return { ok: false, reason: "hasPosts" };
      await prisma.category.delete({ where: { id } });
    } else {
      await prisma.tag.delete({ where: { id } });
    }
  } catch {
    return { ok: false };
  }

  if (existing.image) {
    await deleteImage(existing.image).catch(() => undefined);
  }

  revalidateTaxonomy(kind === "category" ? "categories" : "tags");
  return { ok: true };
}
