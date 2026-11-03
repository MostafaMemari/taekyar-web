import { z } from "zod";

export const mediaQuerySchema = z.object({
  query: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).max(100_000).optional(),
});

export type MediaQueryParams = z.infer<typeof mediaQuerySchema>;

export const mediaDeleteSchema = z.object({
  key: z.string().min(1).max(300),
});
