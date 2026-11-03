import { FAQ_LABELS } from "@/data/dashboard/ui";
import type { FaqFieldErrors, FaqInput, FaqMutationResult, HomepageFaqInput, PostFaqsResult } from "@/types/api";
import { prisma } from "@/server/config/prisma";

export const FAQ_QUESTION_MAX_LENGTH = 300;
export const FAQ_ANSWER_MAX_LENGTH = 5000;

export function normalizeFaqInput(input: FaqInput):
  | { ok: true; data: FaqInput }
  | { ok: false; fieldErrors: FaqFieldErrors } {
  const fieldErrors: FaqFieldErrors = {};
  const question = String(input.question ?? "").trim();
  const answer = String(input.answer ?? "").trim();

  if (!question) {
    fieldErrors.question = FAQ_LABELS.questionRequired;
  } else if (question.length > FAQ_QUESTION_MAX_LENGTH) {
    fieldErrors.question = FAQ_LABELS.questionTooLong;
  }

  if (!answer) {
    fieldErrors.answer = FAQ_LABELS.answerRequired;
  } else if (answer.length > FAQ_ANSWER_MAX_LENGTH) {
    fieldErrors.answer = FAQ_LABELS.answerTooLong;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return { ok: true, data: { question, answer } };
}

export function normalizePostFaqs(value: unknown): FaqInput[] {
  if (!Array.isArray(value)) return [];
  const faqs: FaqInput[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const result = normalizeFaqInput(item as FaqInput);
    if (result.ok) faqs.push(result.data);
  }
  return faqs.slice(0, 30);
}

export async function createHomepageFaq(input: HomepageFaqInput): Promise<FaqMutationResult> {
  const result = normalizeFaqInput(input);
  if (!result.ok) return { ok: false, fieldErrors: result.fieldErrors };

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
    return { ok: false, message: FAQ_LABELS.saveError };
  }

  return { ok: true };
}

export async function updateHomepageFaq(
  input: HomepageFaqInput & { id: number },
): Promise<FaqMutationResult> {
  const result = normalizeFaqInput(input);
  if (!result.ok) return { ok: false, fieldErrors: result.fieldErrors };

  try {
    const updated = await prisma.faq.updateMany({
      where: { id: input.id, location: "HOMEPAGE" },
      data: { ...result.data, isActive: input.isActive },
    });
    if (updated.count === 0) return { ok: false, message: FAQ_LABELS.saveError };
  } catch {
    return { ok: false, message: FAQ_LABELS.saveError };
  }

  return { ok: true };
}

export async function deleteHomepageFaq(id: number): Promise<{ ok: boolean }> {
  try {
    const deleted = await prisma.faq.deleteMany({
      where: { id, location: "HOMEPAGE" },
    });
    if (deleted.count === 0) return { ok: false };
  } catch {
    return { ok: false };
  }

  return { ok: true };
}

export async function toggleHomepageFaq(id: number, isActive: boolean): Promise<{ ok: boolean }> {
  try {
    const updated = await prisma.faq.updateMany({
      where: { id, location: "HOMEPAGE" },
      data: { isActive },
    });
    if (updated.count === 0) return { ok: false };
  } catch {
    return { ok: false };
  }

  return { ok: true };
}

export async function reorderHomepageFaqs(ids: number[]): Promise<{ ok: boolean }> {
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

  return { ok: true };
}

export async function savePostFaqs(postSlug: string, faqs: FaqInput[]): Promise<PostFaqsResult> {
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

  return { ok: true, faqs: normalized };
}
