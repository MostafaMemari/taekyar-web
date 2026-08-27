"use client";

import { useActiveHeading } from "@/hooks/use-active-heading";
import { POST_LABELS } from "@/data/blog/post-config";
import { SidebarSection } from "@/components/blog/sidebar-section";
import type { TocItem } from "@/lib/post-content";
import { cn, toFaDigits } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const activeId = useActiveHeading(items.map((item) => item.id));

  if (items.length === 0) return null;

  return (
    <SidebarSection title={POST_LABELS.tocTitle} icon={BookOpen}>
      <nav aria-label="سرفصل‌های مقاله">
        <ul className="space-y-0.5">
          {items.map((item, index) => {
            const active = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group relative flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors",
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
      </nav>
    </SidebarSection>
  );
}
