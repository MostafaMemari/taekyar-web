"use client";

import { ChevronDown, ListTree } from "lucide-react";

import { useActiveHeading } from "@/components/blog/use-active-heading";
import { POST_LABELS } from "@/components/blog/post-config";
import type { TocItem } from "@/lib/blog-content";
import { cn, toFaDigits } from "@/lib/utils";

interface TocCollapseProps {
  items: TocItem[];
}

export function TocCollapse({ items }: TocCollapseProps) {
  const activeId = useActiveHeading(items.map((item) => item.id));

  if (items.length === 0) return null;

  return (
    <details className="group overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] lg:hidden">
      <summary className="flex min-h-[46px] cursor-pointer list-none items-center gap-2.5 px-3.5 py-3 text-foreground [&::-webkit-details-marker]:hidden sm:min-h-12 sm:px-4">
        <ListTree className="size-4 shrink-0 text-primary" />
        <span className="text-[13px] font-bold leading-5">{POST_LABELS.tocMobileTitle}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground tabular-nums">
          {toFaDigits(items.length)}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="ms-auto size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <nav aria-label="سرفصل‌های مقاله" className="border-t border-black/[0.06] p-2 sm:p-2.5">
        <ul className="space-y-0.5">
          {items.map((item, index) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex min-h-11 items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] leading-6 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "bg-primary/[0.07] font-bold text-primary"
                      : "font-medium text-muted-foreground hover:bg-black/[0.03] hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-px text-[10px] font-bold tabular-nums",
                      active ? "text-primary" : "text-muted-foreground/50"
                    )}
                  >
                    {toFaDigits(index + 1)}.
                  </span>
                  <span>{item.text}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}
