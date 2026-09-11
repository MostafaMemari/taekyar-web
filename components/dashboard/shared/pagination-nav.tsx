import Link from "next/link";

import { BackIcon, ForwardIcon } from "@/components/dashboard/shared/directional-icons";
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
  buildHref: (page: number) => string;
  labels: PaginationNavLabels;
  total?: number;
}

const EDGE_BUTTON_CLASS = "h-10 gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-muted-foreground";
const PAGE_BUTTON_CLASS = "size-10 rounded-lg text-[13px] font-semibold tabular-nums";

export function PaginationNav({ currentPage, totalPages, buildHref, labels, total }: PaginationNavProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <Pagination aria-label={labels.title} className="w-auto justify-center sm:justify-start">
        <PaginationContent className="flex-wrap justify-center sm:justify-start">
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious asChild className={EDGE_BUTTON_CLASS}>
                <Link href={buildHref(currentPage - 1)} rel="prev">
                  <BackIcon className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{labels.prevPage}</span>
                </Link>
              </PaginationPrevious>
            ) : (
              <PaginationPrevious
                aria-disabled="true"
                className={cn(EDGE_BUTTON_CLASS, "pointer-events-none opacity-50")}
              >
                <BackIcon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{labels.prevPage}</span>
              </PaginationPrevious>
            )}
          </PaginationItem>

          {getPageItems(currentPage, totalPages).map((item, index) =>
            item === "dots" ? (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis className="size-10 text-muted-foreground" />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  asChild
                  isActive={item === currentPage}
                  aria-label={`${labels.pageInfoSuffix} ${toFaDigits(item)}`}
                  className={cn(
                    PAGE_BUTTON_CLASS,
                    item === currentPage
                      ? "bg-primary text-primary-foreground"
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
              <PaginationNext asChild className={EDGE_BUTTON_CLASS}>
                <Link href={buildHref(currentPage + 1)} rel="next">
                  <span className="hidden sm:inline">{labels.nextPage}</span>
                  <ForwardIcon className="size-4" aria-hidden="true" />
                </Link>
              </PaginationNext>
            ) : (
              <PaginationNext
                aria-disabled="true"
                className={cn(EDGE_BUTTON_CLASS, "pointer-events-none opacity-50")}
              >
                <span className="hidden sm:inline">{labels.nextPage}</span>
                <ForwardIcon className="size-4" aria-hidden="true" />
              </PaginationNext>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <span className="text-center text-[13px] font-medium tabular-nums text-muted-foreground sm:text-start">
        {toFaDigits(currentPage)} از {toFaDigits(totalPages)} {labels.pageInfoSuffix}
        {total !== undefined && labels.resultsSuffix ? (
          <> · {toFaDigits(total)} {labels.resultsSuffix}</>
        ) : null}
      </span>
    </div>
  );
}
