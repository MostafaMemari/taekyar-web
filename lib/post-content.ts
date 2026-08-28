import { z } from "zod";

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "quote"; text: string };

const postBlockSchema: z.ZodType<PostBlock> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string() }),
  z.object({ type: z.literal("heading"), text: z.string() }),
  z.object({ type: z.literal("list"), items: z.array(z.string()) }),
  z.object({ type: z.literal("tip"), text: z.string() }),
  z.object({ type: z.literal("quote"), text: z.string() }),
]);

const postBlocksSchema = z.array(postBlockSchema);

export function parsePostBlocks(value: unknown): PostBlock[] {
  const result = postBlocksSchema.safeParse(value);
  return result.success ? result.data : [];
}

export interface TocItem {
  id: string;
  text: string;
}

export function getHeadings(blocks: PostBlock[]): TocItem[] {
  return blocks.flatMap((block, index) =>
    block.type === "heading"
      ? [{ id: `heading-${index}`, text: block.text }]
      : []
  );
}
