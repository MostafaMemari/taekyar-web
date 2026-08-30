import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toFaDigits } from "@/lib/utils";

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

export function PaginationNav({ currentPage, totalPages, total, buildHref, labels }: PaginationNavProps) {
  return (
    <Pagination
      aria-label={labels.title}
      className="justify-between rounded-xl border border-border/60 bg-card px-2 py-2 shadow-sm shadow-black/[0.03]"
    >
      <PaginationContent className="w-full items-center justify-between">
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious asChild className="gap-1.5 px-3 text-[13px] font-bold text-muted-foreground">
              <Link href={buildHref(currentPage - 1)} rel="prev">
                <ArrowRight className="size-4" aria-hidden="true" />
                {labels.prevPage}
              </Link>
            </PaginationPrevious>
          ) : (
            <span className="min-h-8 px-3" aria-hidden="true" />
          )}
        </PaginationItem>

        <PaginationItem>
          <span className="rounded-full bg-muted px-3 py-1 text-[13px] font-medium tabular-nums text-muted-foreground ring-1 ring-border/60">
            {toFaDigits(currentPage)} / {toFaDigits(totalPages)} {labels.pageInfoSuffix}
            {total !== undefined && labels.resultsSuffix ? (
              <> · {toFaDigits(total)} {labels.resultsSuffix}</>
            ) : null}
          </span>
        </PaginationItem>

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext asChild className="gap-1.5 px-3 text-[13px] font-bold text-muted-foreground">
              <Link href={buildHref(currentPage + 1)} rel="next">
                {labels.nextPage}
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </PaginationNext>
          ) : (
            <span className="min-h-8 px-3" aria-hidden="true" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
