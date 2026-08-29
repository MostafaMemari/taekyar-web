import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { toFaDigits } from "@/lib/utils";

export interface PaginationNavLabels {
  prevPage: string;
  nextPage: string;
  pageInfoSuffix: string;
  resultsSuffix: string;
  title: string;
}

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  total: number;
  buildHref: (page: number) => string;
  labels: PaginationNavLabels;
}

export function PaginationNav({ currentPage, totalPages, total, buildHref, labels }: PaginationNavProps) {
  return (
    <nav
      className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-2 py-2 shadow-sm shadow-black/[0.03]"
      aria-label={labels.title}
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          {labels.prevPage}
        </Link>
      ) : (
        <span className="min-h-8 px-3" aria-hidden="true" />
      )}

      <span className="rounded-full bg-muted px-3 py-1 text-[13px] font-medium tabular-nums text-muted-foreground ring-1 ring-border/60">
        {toFaDigits(currentPage)} / {toFaDigits(totalPages)} {labels.pageInfoSuffix} ·{" "}
        {toFaDigits(total)} {labels.resultsSuffix}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {labels.nextPage}
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className="min-h-8 px-3" aria-hidden="true" />
      )}
    </nav>
  );
}
