import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BLOG_PAGINATION } from "@/data/blog/index-page";
import { cn, toFaDigits } from "@/lib/utils";

type PageItem = number | "dots";

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

const edgeChipClass =
  "h-9 min-w-9 gap-1 rounded-full border-transparent bg-card px-3 text-[13px] font-medium text-muted-foreground hover:border-primary/30 hover:bg-card hover:text-primary";

function pageChipClass(active: boolean) {
  return cn(
    "h-9 min-w-9 rounded-full px-3 text-[13px] font-medium",
    active
      ? "border-primary bg-primary text-white shadow-sm shadow-primary/20 ring-1 ring-primary/20 hover:bg-primary hover:text-white"
      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-card hover:text-foreground",
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
    <Pagination aria-label={BLOG_PAGINATION.navLabel} className="flex-wrap">
      <PaginationContent className="flex-wrap gap-1.5">
        <PaginationItem>
          {prevPage !== null ? (
            <PaginationPrevious asChild className={edgeChipClass}>
              <Link href={hrefFor(prevPage)} rel="prev">
                <ArrowRight className="size-4" aria-hidden="true" />
                {BLOG_PAGINATION.prev}
              </Link>
            </PaginationPrevious>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex h-9 cursor-default items-center gap-1 rounded-full border border-transparent px-3 text-[13px] font-medium text-muted-foreground/50"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
              {BLOG_PAGINATION.prev}
            </span>
          )}
        </PaginationItem>

        {pageItems(currentPage, totalPages).map((item, index) =>
          item === "dots" ? (
            <PaginationItem key={`dots-${index}`}>
              <PaginationEllipsis className="text-muted-foreground" />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                asChild
                isActive={item === currentPage}
                aria-label={`${BLOG_PAGINATION.goTo} ${toFaDigits(item)}`}
                className={pageChipClass(item === currentPage)}
                size="default"
              >
                <Link href={hrefFor(item)}>{toFaDigits(item)}</Link>
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {nextPage !== null ? (
            <PaginationNext asChild className={edgeChipClass}>
              <Link href={hrefFor(nextPage)} rel="next">
                {BLOG_PAGINATION.next}
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </PaginationNext>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex h-9 cursor-default items-center gap-1 rounded-full border border-transparent px-3 text-[13px] font-medium text-muted-foreground/50"
            >
              {BLOG_PAGINATION.next}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
