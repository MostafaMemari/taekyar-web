import { Check } from "lucide-react";

import type { PostBlock } from "@/lib/blog-content";

export const HEADING_ID_PREFIX = "heading";

function Heading({ id, text }: { id: string; text: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-xl font-extrabold leading-[1.6] sm:text-2xl sm:leading-[1.5]"
    >
      {text}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check className="mt-1.5 size-4 shrink-0 text-belt-green" strokeWidth={2.5} />
          <span className="text-[15px] leading-8 text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="rounded-2xl border-s-[3px] border-primary bg-[#fafaf8] p-4 text-[15px] font-medium leading-8 text-foreground sm:p-5">
      {text}
    </blockquote>
  );
}

function Paragraph({ text }: { text: string }) {
  return (
    <p className="text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
      {text}
    </p>
  );
}

function PostBlockRenderer({ block, index }: { block: PostBlock; index: number }) {
  switch (block.type) {
    case "heading":
      return <Heading id={`${HEADING_ID_PREFIX}-${index}`} text={block.text} />;
    case "list":
      return <BulletList items={block.items} />;
    case "quote":
      return <Quote text={block.text} />;
    default:
      return <Paragraph text={block.text} />;
  }
}

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-5 [&_h2:not(:first-child)]:mt-9">
      {blocks.map((block, index) => (
        <PostBlockRenderer key={index} block={block} index={index} />
      ))}
    </div>
  );
}
