"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import type { TocItem } from "@/lib/blog-content";
import { cn, toFaDigits } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const marker = window.scrollY + 160;
      let current: string | null = null;

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = item.id;
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="سرفصل‌های مقاله"
      className="hidden lg:sticky lg:top-[84px] lg:block"
    >
      <div className="max-h-[calc(100vh-116px)] overflow-y-auto rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <BookOpen className="size-4 text-primary" />
          <p className="text-xs font-bold text-foreground">سرفصل‌ها</p>
        </div>

        <ul className="space-y-0.5 p-2.5">
          {items.map((item, index) => {
            const active = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                    active
                      ? "bg-primary/[0.06] text-primary"
                      : "text-muted-foreground hover:bg-black/[0.03] hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-[10px] font-bold tabular-nums",
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
