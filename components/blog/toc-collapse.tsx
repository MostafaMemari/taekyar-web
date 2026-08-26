import { ChevronDown, ListTree } from "lucide-react";

import { POST_LABELS } from "@/components/blog/post-config";
import type { TocItem } from "@/lib/blog-content";
import { toFaDigits } from "@/lib/utils";

interface TocCollapseProps {
  items: TocItem[];
}

export function TocCollapse({ items }: TocCollapseProps) {
  if (items.length === 0) return null;

  return (
    <details className="group overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] lg:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2.5 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <ListTree className="size-4 text-primary" />
        <span className="text-[13px] font-bold text-foreground">
          {POST_LABELS.tocMobileTitle}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground tabular-nums">
          {toFaDigits(items.length)}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="ms-auto size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <nav aria-label="سرفصل‌های مقاله" className="border-t border-black/[0.06] p-2.5">
        <ul>
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex min-h-11 items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-medium leading-6 text-muted-foreground transition-colors hover:bg-black/[0.03] hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span
                  aria-hidden="true"
                  className="mt-px text-[10px] font-bold tabular-nums text-muted-foreground/50"
                >
                  {toFaDigits(index + 1)}.
                </span>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
