"use client";

import { useActiveHeading } from "@/components/blog/hooks/use-active-heading";
import { POST_LABELS } from "@/data/blog/post-config";
import { SidebarSection } from "@/components/blog/sidebar-section";
import type { TocItem } from "@/lib/post-content";
import { cn } from "@/lib/utils";
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
        <ol className="relative space-y-0.5 ps-4">
          <span
            aria-hidden="true"
            className="absolute inset-y-1.5 start-[5px] w-px bg-border/70"
          />
          {items.map((item) => {
            const active = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group relative flex min-h-8 items-start rounded-lg px-2.5 py-1.5 transition-colors",
                    active
                      ? "bg-primary/[0.07] text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -start-[15px] top-1/2 size-2 -translate-y-1/2 rounded-full transition-colors",
                      active
                        ? "bg-primary shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"
                        : "bg-border group-hover:bg-muted-foreground/50"
                    )}
                  />
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
        </ol>
      </nav>
    </SidebarSection>
  );
}
