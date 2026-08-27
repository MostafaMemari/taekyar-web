import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { BLOG_PAGINATION } from "@/data/blog/index-page";
import { cn, toFaDigits } from "@/lib/utils";

type PageItem = number | "dots";

const chipBase =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

function pageChipClass(active: boolean) {
  return cn(
    chipBase,
    active
      ? "border-primary bg-primary text-white shadow-sm shadow-primary/20 ring-1 ring-primary/20"
      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
  );
}

function pageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const wanted = new Set([1, 2, current - 1, current, current + 1, total - 1, total].filter((page) => page >= 1 && page <= total));
  const sorted = [...wanted].sort((first, second) => first - second);

  const items: PageItem[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) items.push("dots");
    items.push(page);
    previous = page;
  }
  return items;
}

interface EdgeLinkProps {
  page: number | null;
  hrefFor: (page: number) => string;
  label: string;
  ariaLabel: string;
  rel: "prev" | "next";
}

function EdgeLink({ page, hrefFor, label, ariaLabel, rel }: EdgeLinkProps) {
  const Icon = rel === "prev" ? ArrowRight : ArrowLeft;

  if (page === null) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex h-9 cursor-default items-center gap-1 rounded-full border border-transparent px-3 text-[13px] font-medium text-muted-foreground/50"
      >
        {rel === "prev" && <Icon className="size-4" aria-hidden="true" />}
        {label}
        {rel === "next" && <Icon className="size-4" aria-hidden="true" />}
      </span>
    );
  }

  return (
    <Link
      href={hrefFor(page)}
      aria-label={ariaLabel}
      rel={rel}
      className={cn(chipBase, "gap-1 border-transparent bg-card text-muted-foreground hover:border-primary/30 hover:text-primary")}
    >
      {rel === "prev" && <Icon className="size-4" aria-hidden="true" />}
      {label}
      {rel === "next" && <Icon className="size-4" aria-hidden="true" />}
    </Link>
  );
}

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

export function BlogPagination({ currentPage, totalPages, hrefFor }: BlogPaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav aria-label={BLOG_PAGINATION.navLabel} className="flex flex-wrap justify-center">
      <ul className="flex flex-wrap items-center gap-1.5">
        <EdgeLink page={prevPage} hrefFor={hrefFor} label={BLOG_PAGINATION.prev} ariaLabel={BLOG_PAGINATION.prev} rel="prev" />

        {pageItems(currentPage, totalPages).map((item, index) =>
          item === "dots" ? (
            <li key={`dots-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`${BLOG_PAGINATION.goTo} ${toFaDigits(item)}`}
                className={pageChipClass(item === currentPage)}
              >
                {toFaDigits(item)}
              </Link>
            </li>
          ),
        )}

        <EdgeLink page={nextPage} hrefFor={hrefFor} label={BLOG_PAGINATION.next} ariaLabel={BLOG_PAGINATION.next} rel="next" />
      </ul>
    </nav>
  );
}
