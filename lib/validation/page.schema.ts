import { z } from "zod";

import { seoOverrideSchema } from "./post.schema";

export const pageInputSchema = seoOverrideSchema.extend({
  title: z.string().max(300),
  slug: z.string().max(300),
  content: z.string().max(600_000).nullable().default(null),
  coverImage: z.string().max(600).nullable().default(null),
  coverImageAlt: z.string().max(300).nullable().default(null),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type PageBody = z.infer<typeof pageInputSchema>;
