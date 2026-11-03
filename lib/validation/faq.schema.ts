import { z } from "zod";

export const homepageFaqSchema = z.object({
  question: z.string().max(400),
  answer: z.string().max(6000),
  isActive: z.boolean(),
});

export type HomepageFaqBody = z.infer<typeof homepageFaqSchema>;

export const faqToggleSchema = z.object({
  isActive: z.boolean(),
});

export const faqReorderSchema = z.object({
  ids: z.array(z.number().int().positive()).max(100),
});
