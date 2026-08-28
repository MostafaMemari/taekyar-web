import { z } from "zod";

export type HeadingLevel = 1 | 2 | 3 | 4;

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: HeadingLevel; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "tip"; text: string }
  | { type: "warning"; text: string }
  | { type: "divider" }
  | { type: "image"; src: string; alt: string; caption: string | null };

const postBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string() }),
  z.object({
    type: z.literal("heading"),
    level: z.number().int().min(1).max(4).nullish(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().nullish(),
    items: z.array(z.string()),
  }),
  z.object({ type: z.literal("quote"), text: z.string() }),
  z.object({ type: z.literal("tip"), text: z.string() }),
  z.object({ type: z.literal("warning"), text: z.string() }),
  z.object({ type: z.literal("divider") }),
  z.object({
    type: z.literal("image"),
    src: z.string(),
    alt: z.string().nullish(),
    caption: z.string().nullish(),
  }),
]);

const postBlocksSchema = z.array(postBlockSchema);

function normalizeBlock(block: z.infer<typeof postBlockSchema>): PostBlock | null {
  switch (block.type) {
    case "paragraph":
    case "quote":
    case "tip":
    case "warning":
      return { type: block.type, text: block.text };
    case "heading":
      return { type: "heading", level: (block.level ?? 2) as HeadingLevel, text: block.text };
    case "list":
      return { type: "list", ordered: block.ordered ?? false, items: block.items };
    case "divider":
      return { type: "divider" };
    case "image":
      if (!block.src) return null;
      return { type: "image", src: block.src, alt: block.alt ?? "", caption: block.caption ?? null };
  }
}

export function parsePostBlocks(value: unknown): PostBlock[] {
  const result = postBlocksSchema.safeParse(value);
  if (!result.success) return [];
  return result.data
    .map(normalizeBlock)
    .filter((block): block is PostBlock => block !== null);
}

export function headingId(index: number): string {
  return `heading-${index}`;
}

export interface TocItem {
  id: string;
  text: string;
}

export function getHeadings(blocks: PostBlock[]): TocItem[] {
  return blocks.flatMap((block, index) =>
    block.type === "heading" ? [{ id: headingId(index), text: block.text }] : [],
  );
}
