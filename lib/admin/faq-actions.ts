"use server";

import { FAQ_LABELS } from "@/data/dashboard/ui";
import type { FaqFormState, FaqInput, HomepageFaqInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { normalizeFaqInput, normalizePostFaqs, requireSession, revalidateFaqPaths } from "./shared";

export async function createHomepageFaq(
  _previousState: FaqFormState,
  input: HomepageFaqInput,
): Promise<FaqFormState> {
  await requireSession();

  const result = normalizeFaqInput(input);
  if (!result.ok) return { status: "error", fieldErrors: result.fieldErrors };

  try {
    const maxOrder = await prisma.faq.aggregate({
      where: { location: "HOMEPAGE" },
      _max: { order: true },
    });
    await prisma.faq.create({
      data: {
        ...result.data,
        location: "HOMEPAGE",
        order: (maxOrder._max.order ?? -1) + 1,
        isActive: input.isActive,
      },
    });
  } catch {
    return { status: "error", message: FAQ_LABELS.saveError };
  }

  revalidateFaqPaths();
  return { status: "idle" };
}

export async function updateHomepageFaq(
  _previousState: FaqFormState,
  input: HomepageFaqInput & { id: number },
): Promise<FaqFormState> {
  await requireSession();

  const result = normalizeFaqInput(input);
  if (!result.ok) return { status: "error", fieldErrors: result.fieldErrors };

  try {
    const updated = await prisma.faq.updateMany({
      where: { id: input.id, location: "HOMEPAGE" },
      data: { ...result.data, isActive: input.isActive },
    });
    if (updated.count === 0) return { status: "error", message: FAQ_LABELS.saveError };
  } catch {
    return { status: "error", message: FAQ_LABELS.saveError };
  }

  revalidateFaqPaths();
  return { status: "idle" };
}

export async function deleteHomepageFaq(id: number): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    const deleted = await prisma.faq.deleteMany({
      where: { id, location: "HOMEPAGE" },
    });
    if (deleted.count === 0) return { ok: false };
  } catch {
    return { ok: false };
  }

  revalidateFaqPaths();
  return { ok: true };
}

export async function toggleHomepageFaq(id: number, isActive: boolean): Promise<{ ok: boolean }> {
  await requireSession();

  try {
    const updated = await prisma.faq.updateMany({
      where: { id, location: "HOMEPAGE" },
      data: { isActive },
    });
    if (updated.count === 0) return { ok: false };
  } catch {
    return { ok: false };
  }

  revalidateFaqPaths();
  return { ok: true };
}

export async function reorderHomepageFaqs(ids: number[]): Promise<{ ok: boolean }> {
  await requireSession();

  const uniqueIds = Array.from(new Set(ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)));
  if (uniqueIds.length === 0) return { ok: false };

  try {
    await prisma.$transaction(
      uniqueIds.map((id, index) =>
        prisma.faq.updateMany({
          where: { id, location: "HOMEPAGE" },
          data: { order: index },
        }),
      ),
    );
  } catch {
    return { ok: false };
  }

  revalidateFaqPaths();
  return { ok: true };
}

export async function savePostFaqs(
  postSlug: string,
  faqs: FaqInput[],
): Promise<{ ok: boolean; faqs: FaqInput[] }> {
  await requireSession();

  const post = await prisma.post.findUnique({
    where: { slug: postSlug },
    select: { id: true, slug: true, deletedAt: true },
  });
  if (!post || post.deletedAt) return { ok: false, faqs: [] };

  const normalized = normalizePostFaqs(faqs);

  try {
    await prisma.$transaction([
      prisma.faq.deleteMany({ where: { postId: post.id, location: "BLOG" } }),
      ...(normalized.length > 0
        ? [
            prisma.faq.createMany({
              data: normalized.map((faq, index) => ({
                ...faq,
                location: "BLOG" as const,
                postId: post.id,
                order: index,
                isActive: true,
              })),
            }),
          ]
        : []),
    ]);
  } catch {
    return { ok: false, faqs: [] };
  }

  revalidateFaqPaths(post.slug);
  return { ok: true, faqs: normalized };
}
