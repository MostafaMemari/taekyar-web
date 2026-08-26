import { Lightbulb } from "lucide-react";

import { POST_LABELS } from "@/components/blog/post-config";
import type { PostBlock } from "@/lib/blog-content";

export const HEADING_ID_PREFIX = "heading";

function Heading({ id, text }: { id: string; text: string }) {
  return (
    <h2
      id={id}
      className="flex scroll-mt-28 items-center gap-2.5 pt-5 text-[1.15rem] font-black leading-[1.6] text-foreground sm:gap-3 sm:pt-6 sm:text-[1.35rem] sm:leading-[1.5]"
    >
      <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-primary sm:h-6" />
      {text}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 sm:space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[12px] size-1.5 shrink-0 rounded-full bg-belt-green sm:mt-[13px]"
          />
          <span className="text-[14.5px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="relative overflow-hidden rounded-2xl border-s-[3px] border-primary bg-background p-4 ps-10 sm:p-6 sm:ps-14">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-3.5 top-3.5 select-none text-lg font-black leading-none text-primary/15 sm:start-4 sm:top-4 sm:text-xl"
      >
        «»
      </span>
      <p className="text-[14.5px] font-semibold leading-7 text-foreground/90 sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
        {text}
      </p>
    </blockquote>
  );
}

function CoachTip({ text }: { text: string }) {
  return (
    <aside className="flex gap-2.5 rounded-xl border border-belt-yellow/40 bg-belt-yellow/[0.09] p-3.5 sm:gap-3.5 sm:p-5">
      <Lightbulb
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-[#8a6d00] sm:size-5"
        strokeWidth={2}
      />
      <div>
        <p className="text-[11px] font-bold text-[#8a6d00] sm:text-xs">{POST_LABELS.coachTipLabel}</p>
        <p className="mt-1 text-[13px] leading-6 text-foreground/90 sm:text-sm sm:leading-7">{text}</p>
      </div>
    </aside>
  );
}

function Paragraph({ text, lead = false }: { text: string; lead?: boolean }) {
  if (lead) {
    return (
      <p className="text-[15px] font-medium leading-8 text-foreground/80 sm:text-base sm:leading-9 lg:text-lg lg:leading-10">
        {text}
      </p>
    );
  }

  return (
    <p className="text-[14.5px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8 lg:text-base lg:leading-9">
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
    case "tip":
      return <CoachTip text={block.text} />;
    case "quote":
      return <Quote text={block.text} />;
    default:
      return <Paragraph text={block.text} lead={index === 0} />;
  }
}

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-5 sm:space-y-6">{blocks.map((block, index) => (
      <PostBlockRenderer key={index} block={block} index={index} />
    ))}</div>
  );
}
