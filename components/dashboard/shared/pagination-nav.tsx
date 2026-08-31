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
import { cn, getPageItems, toFaDigits } from "@/lib/utils";

export interface PaginationNavLabels {
  prevPage: string;
  nextPage: string;
  pageInfoSuffix: string;
  resultsSuffix?: string;
  title: string;
}

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  total?: number;
  buildHref: (page: number) => string;
  labels: PaginationNavLabels;
}

const edgeButtonClass = "gap-1.5 px-3 text-[13px] font-bold text-muted-foreground";

export function PaginationNav({ currentPage, totalPages, total, buildHref, labels }: PaginationNavProps) {
  return (
    <Pagination
      aria-label={labels.title}
      className="flex-col gap-2 rounded-xl border border-border/60 bg-card px-2 py-2 shadow-sm shadow-black/[0.03]"
    >
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious asChild className={edgeButtonClass}>
              <Link href={buildHref(currentPage - 1)} rel="prev">
                <ArrowRight className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{labels.prevPage}</span>
              </Link>
            </PaginationPrevious>
          ) : (
            <PaginationPrevious aria-disabled="true" className={cn(edgeButtonClass, "pointer-events-none opacity-50")}>
              <ArrowRight className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{labels.prevPage}</span>
            </PaginationPrevious>
          )}
        </PaginationItem>

        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === "dots" ? (
            <PaginationItem key={`dots-${index}`}>
              <PaginationEllipsis className="size-8 text-muted-foreground" />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                asChild
                isActive={item === currentPage}
                aria-label={`${labels.pageInfoSuffix} ${toFaDigits(item)}`}
                className={cn(
                  "min-w-8 px-2 text-[13px] font-bold tabular-nums",
                  item === currentPage
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Link href={buildHref(item)}>{toFaDigits(item)}</Link>
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext asChild className={edgeButtonClass}>
              <Link href={buildHref(currentPage + 1)} rel="next">
                <span className="hidden sm:inline">{labels.nextPage}</span>
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </PaginationNext>
          ) : (
            <PaginationNext aria-disabled="true" className={cn(edgeButtonClass, "pointer-events-none opacity-50")}>
              <span className="hidden sm:inline">{labels.nextPage}</span>
              <ArrowLeft className="size-4" aria-hidden="true" />
            </PaginationNext>
          )}
        </PaginationItem>
      </PaginationContent>

      <span className="text-center text-[13px] font-medium tabular-nums text-muted-foreground">
        {toFaDigits(currentPage)} / {toFaDigits(totalPages)} {labels.pageInfoSuffix}
        {total !== undefined && labels.resultsSuffix ? (
          <> · {toFaDigits(total)} {labels.resultsSuffix}</>
        ) : null}
      </span>
    </Pagination>
  );
}
