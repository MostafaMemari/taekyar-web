import type { PostBlock } from "@/lib/post-content";

export type BlockType = PostBlock["type"];

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

export interface BlockMenuGroup {
  label: string;
  types: BlockType[];
}

export const BLOCK_MENU_GROUPS: BlockMenuGroup[] = [
  { label: "نوشتار", types: ["paragraph", "heading"] },
  { label: "رسانه", types: ["image"] },
  { label: "فهرست", types: ["list"] },
  { label: "ویژه", types: ["tip", "quote", "warning", "divider"] },
];

export function defaultBlock(type: BlockType): PostBlock {
  switch (type) {
    case "paragraph":
    case "quote":
    case "tip":
    case "warning":
      return { type, text: "" };
    case "heading":
      return { type, level: 2, text: "" };
    case "list":
      return { type, ordered: false, items: [""] };
    case "divider":
      return { type: "divider" };
    case "image":
      return { type: "image", src: "", alt: "", caption: null };
  }
}
