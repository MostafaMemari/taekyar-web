import { cache } from "react";

import { prisma } from "@/lib/prisma";

export interface PublicFaq {
  id: number;
  question: string;
  answer: string;
}

export const getHomepageFaqs = cache(async (): Promise<PublicFaq[]> => {
  try {
    const faqs = await prisma.faq.findMany({
      where: { location: "HOMEPAGE", isActive: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, question: true, answer: true },
    });
    return faqs;
  } catch {
    return [];
  }
});

export const getPostFaqs = cache(async (postId: number): Promise<PublicFaq[]> => {
  try {
    const faqs = await prisma.faq.findMany({
      where: { postId, isActive: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, question: true, answer: true },
    });
    return faqs;
  } catch {
    return [];
  }
});

export function faqJsonLd(faqs: PublicFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
