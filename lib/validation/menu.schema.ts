import { z } from "zod";

export const menuItemSchema = z.object({
  title: z.string().max(200),
  type: z.enum(["PAGE", "POST", "CATEGORY", "TAG", "CUSTOM"]),
  pageId: z.number().int().positive().nullish(),
  postId: z.number().int().positive().nullish(),
  categoryId: z.number().int().positive().nullish(),
  tagId: z.number().int().positive().nullish(),
  customUrl: z.string().max(1000).nullish(),
  parentId: z.number().int().positive().nullish(),
  location: z.enum(["HEADER_DESKTOP", "HEADER_MOBILE", "FOOTER_QUICK", "FOOTER_BLOG"]),
});

export type MenuItemBody = z.infer<typeof menuItemSchema>;

export const menuMoveSchema = z.object({
  direction: z.enum(["up", "down"]),
});
