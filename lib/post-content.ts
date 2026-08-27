export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "quote"; text: string };

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
