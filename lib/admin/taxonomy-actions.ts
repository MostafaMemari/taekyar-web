"use server";

import { redirect } from "next/navigation";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostFormState, TaxonomyInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/r2";
import { normalizeTaxonomyInput, requireSession, revalidateTaxonomy } from "./shared";

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
      if (id === null) {
        await prisma.category.create({ data });
      } else {
        await prisma.category.update({ where: { id }, data });
      }
    } else if (id === null) {
      await prisma.tag.create({ data });
    } else {
      await prisma.tag.update({ where: { id }, data });
    }
  } catch {
    return { status: "error", message: POST_FORM_LABELS.slugTaken };
  }

  revalidateTaxonomy(kind === "category" ? "categories" : "tags");
  redirect(`/dashboard/${kind === "category" ? "categories" : "tags"}`);
}

export async function deleteTaxonomy(kind: "category" | "tag", id: number): Promise<{ ok: boolean }> {
  await requireSession();

  const existing =
    kind === "category"
      ? await prisma.category.findUnique({ where: { id }, select: { image: true } })
      : await prisma.tag.findUnique({ where: { id }, select: { image: true } });
  if (!existing) return { ok: false };

  try {
    if (kind === "category") {
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
