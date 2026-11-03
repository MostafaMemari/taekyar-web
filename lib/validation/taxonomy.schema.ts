import { z } from "zod";

import { seoOverrideSchema } from "./post.schema";

export const taxonomyInputSchema = seoOverrideSchema.extend({
  name: z.string().max(200),
  slug: z.string().max(300),
  parentId: z.number().int().positive().nullable().default(null),
  image: z.string().max(600).nullable().default(null),
  imageAlt: z.string().max(300).nullable().default(null),
  description: z.string().max(20_000).nullable().default(null),
});

export type TaxonomyBody = z.infer<typeof taxonomyInputSchema>;
