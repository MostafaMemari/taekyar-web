"use client";

import { List } from "lucide-react";

import { useActiveHeading } from "@/components/blog/hooks/use-active-heading";
import { POST_LABELS } from "@/data/blog/post-config";
import type { TocItem } from "@/lib/post-content";
import { cn, toFaDigits } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const activeId = useActiveHeading(items.map((item) => item.id));

  if (items.length === 0) return null;

  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-2 border-b border-[#E0A800]/25 pb-3">
        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#a37800]">
          <List className="size-4" />
          {POST_LABELS.tocTitle}
        </span>
        <span className="text-[11px] font-bold text-black/40">
          {toFaDigits(items.length)} بخش
        </span>
      </div>

      <nav aria-label="سرفصل‌های مقاله" className="mt-3">
        <ol className="flex flex-col gap-1">
          {items.map((item, index) => {
            const active = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors",
                    active ? "bg-[#E0A800]/[0.08]" : "hover:bg-black/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black transition-colors",
                      active
                        ? "bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-[#2A1F00] shadow-[0_6px_12px_-6px_rgba(154,109,0,0.6)]"
                        : "bg-[#F5F1EA] text-black/45",
                    )}
                  >
                    {toFaDigits(index + 1)}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] leading-6",
                      active ? "font-extrabold text-[#a37800]" : "font-medium text-black/55 group-hover:text-[#1b2330]",
                    )}
                  >
                    {item.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
