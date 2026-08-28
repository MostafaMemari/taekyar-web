import type { PostBlock } from "@/lib/post-content";

export interface FieldDraft {
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  date: string;
  readTimeMinutes: string;
  metaTitle: string;
  metaDescription: string;
}

export const BLOCK_TYPE_ITEMS: PostBlock["type"][] = ["paragraph", "heading", "list", "tip", "quote"];

export function defaultBlock(type: PostBlock["type"]): PostBlock {
  return type === "list" ? { type: "list", items: [""] } : { type, text: "" };
}
