"use client";

import { useActiveHeading } from "@/components/blog/use-active-heading";
import { POST_LABELS } from "@/components/blog/post-config";
import type { TocItem } from "@/lib/blog-content";
import { cn, toFaDigits } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const activeId = useActiveHeading(items.map((item) => item.id));

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="سرفصل‌های مقاله"
      className="hidden lg:sticky lg:top-[84px] lg:block"
    >
      <div className="overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <BookOpen className="size-4 text-primary" />
          <p className="text-xs font-bold text-foreground">{POST_LABELS.tocTitle}</p>
        </div>

        <ul className="max-h-[calc(100vh-13rem)] space-y-0.5 overflow-y-auto p-2.5">
          {items.map((item, index) => {
            const active = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                    active
                      ? "bg-primary/[0.07] text-primary"
                      : "text-muted-foreground hover:bg-black/[0.03] hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[3px] text-[10px] font-bold tabular-nums",
                      active
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-muted-foreground"
                    )}
                  >
                    {toFaDigits(index + 1)}.
                  </span>
                  <span
                    className={cn(
                      "text-[13px] leading-6",
                      active ? "font-bold" : "font-medium"
                    )}
                  >
                    {item.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
