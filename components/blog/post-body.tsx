import { Lightbulb } from "lucide-react";

import { POST_LABELS } from "@/components/blog/post-config";
import type { PostBlock } from "@/lib/blog-content";

export const HEADING_ID_PREFIX = "heading";

function Heading({ id, text }: { id: string; text: string }) {
  return (
    <h2
      id={id}
      className="flex scroll-mt-28 items-center gap-3 pt-6 text-xl font-black leading-[1.6] text-foreground sm:text-[1.35rem] sm:leading-[1.5]"
    >
      <span aria-hidden="true" className="h-6 w-1 shrink-0 rounded-full bg-primary" />
      {text}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[13px] size-1.5 shrink-0 rounded-full bg-belt-green"
          />
          <span className="text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="relative overflow-hidden rounded-2xl border-s-[3px] border-primary bg-background p-5 ps-12 sm:p-6 sm:ps-14">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-4 top-4 select-none font-black leading-none text-primary/15"
      >
        «»
      </span>
      <p className="text-[15px] font-semibold leading-8 text-foreground/90 sm:text-base sm:leading-9">
        {text}
      </p>
    </blockquote>
  );
}

function CoachTip({ text }: { text: string }) {
  return (
    <aside className="flex gap-3 rounded-xl border border-belt-yellow/40 bg-belt-yellow/[0.09] p-4 sm:gap-3.5 sm:p-5">
      <Lightbulb
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-[#8a6d00]"
        strokeWidth={2}
      />
      <div>
        <p className="text-xs font-bold text-[#8a6d00]">{POST_LABELS.coachTipLabel}</p>
        <p className="mt-1 text-sm leading-7 text-foreground/90">{text}</p>
      </div>
    </aside>
  );
}

function Paragraph({ text, lead = false }: { text: string; lead?: boolean }) {
  if (lead) {
    return (
      <p className="text-base font-medium leading-9 text-foreground/80 sm:text-lg sm:leading-10">
        {text}
      </p>
    );
  }

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
    <div className="space-y-6">{blocks.map((block, index) => (
      <PostBlockRenderer key={index} block={block} index={index} />
    ))}</div>
  );
}
