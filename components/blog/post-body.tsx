import { Check } from "lucide-react";

import type { PostBlock } from "@/lib/blog-content";

function renderBlock(block: PostBlock, index: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={index}
          id={`heading-${index}`}
          className="scroll-mt-28 pt-2 text-xl font-extrabold leading-[1.6] sm:text-2xl sm:leading-[1.5]"
        >
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul key={index} className="space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check className="mt-1.5 size-4 shrink-0 text-belt-green" strokeWidth={2.5} />
              <span className="text-[15px] leading-8 text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="rounded-2xl border-s-4 border-primary/70 bg-[#fafaf8] p-4 text-[15px] font-medium leading-8 text-foreground sm:p-5"
        >
          {block.text}
        </blockquote>
      );
    default:
      return (
        <p key={index} className="text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
          {block.text}
        </p>
      );
  }
}

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
