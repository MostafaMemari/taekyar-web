import { z } from "zod";

export const seoOverrideSchema = z.object({
  seoTitle: z.string().max(300).nullable().default(null),
  seoDescription: z.string().max(1000).nullable().default(null),
  keywords: z.string().max(1000).nullable().default(null),
  canonical: z.string().max(1000).nullable().default(null),
  robotsTags: z.string().max(200).nullable().default(null),
});

export const faqInputSchema = z.object({
  question: z.string().max(400),
  answer: z.string().max(6000),
});

export const postInputSchema = seoOverrideSchema.extend({
  title: z.string().max(300),
  slug: z.string().max(300),
  excerpt: z.string().max(3000).nullable().default(null),
  categoryIds: z.array(z.number()).max(100),
  tagIds: z.array(z.number()).max(100),
  readTimeMinutes: z.union([z.number(), z.string()]).nullable().default(null),
  content: z.string().max(600_000).nullable().default(null),
  coverImage: z.string().max(600).nullable().default(null),
  coverImageAlt: z.string().max(300).nullable().default(null),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  faqs: z.array(faqInputSchema).max(30).optional(),
});

export type PostBody = z.infer<typeof postInputSchema>;

export const postFaqsSchema = z.object({
  faqs: z.array(faqInputSchema).max(30),
});
