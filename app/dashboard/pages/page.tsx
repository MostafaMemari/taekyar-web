import Link from "next/link";
import Image from "next/image";
import { FileText, Pencil } from "lucide-react";

import { DeletePageButton } from "@/components/dashboard/pages/delete-page-button";
import { ForwardIcon } from "@/components/dashboard/shared/directional-icons";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import {
  DashboardTable,
  DashboardTableCell,
  DashboardTableRow,
} from "@/components/dashboard/shared/dashboard-table";
import {
  DashboardCountChip,
  DashboardSearchField,
  DashboardToolbar,
} from "@/components/dashboard/shared/dashboard-toolbar";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { RowActionButton } from "@/components/dashboard/shared/row-action-button";
import { resolveContentTone, StatusBadge } from "@/components/dashboard/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAGES_TABLE_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { pageHref } from "@/lib/routes";
import { r2PublicUrl } from "@/lib/r2-url";
import { formatFaDate } from "@/lib/utils";

interface PagesPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const PAGES_PER_PAGE = 10;

export const metadata = { title: PAGES_TABLE_LABELS.title };

export default async function DashboardPagesPage({ searchParams }: PagesPageProps) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const where = query
    ? { OR: [{ title: { contains: query } }, { slug: { contains: query } }] }
    : {};

  const total = await prisma.page.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGES_PER_PAGE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const pages = await prisma.page.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (currentPage - 1) * PAGES_PER_PAGE,
    take: PAGES_PER_PAGE,
  });

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `/dashboard/pages?${queryString}` : "/dashboard/pages";
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={PAGES_TABLE_LABELS.title}
        description={PAGES_TABLE_LABELS.description}
        actions={
          <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
            <Link href="/dashboard/pages/new">
              {PAGES_TABLE_LABELS.newPage}
              <ForwardIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <Card className="gap-0 rounded-xl p-0 shadow-none">
        <DashboardToolbar>
          <DashboardSearchField
            action="/dashboard/pages"
            label={PAGES_TABLE_LABELS.searchLabel}
            placeholder={PAGES_TABLE_LABELS.searchPlaceholder}
            defaultValue={query}
          />
          <DashboardCountChip count={total} suffix={PAGES_TABLE_LABELS.resultsSuffix} />
        </DashboardToolbar>

        {pages.length === 0 ? (
          <DashboardEmptyState
            title={PAGES_TABLE_LABELS.empty}
            hint={query ? "جستجوی دیگری را امتحان کنید یا فیلتر را پاک کنید." : PAGES_TABLE_LABELS.emptyHint}
            action={
              query ? (
                <Button variant="outline" asChild className="h-10 rounded-lg px-4 text-[13px] font-bold">
                  <Link href="/dashboard/pages">پاک کردن جستجو</Link>
                </Button>
              ) : (
                <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
                  <Link href="/dashboard/pages/new">
                    {PAGES_TABLE_LABELS.newPage}
                    <ForwardIcon className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <PagesTable pages={pages} />
        )}
      </Card>

      {totalPages > 1 ? (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          buildHref={buildHref}
          labels={PAGES_TABLE_LABELS}
        />
      ) : null}
    </div>
  );
}

interface PagesTableProps {
  pages: Array<{
    id: number;
    slug: string;
    title: string;
    coverImage: string | null;
    status: "DRAFT" | "PUBLISHED";
    updatedAt: Date;
  }>;
}

function PagesTable({ pages }: PagesTableProps) {
  return (
    <DashboardTable
      caption={PAGES_TABLE_LABELS.title}
      minWidth="min-w-[720px]"
      hiddenOnMobile={[3]}
      headers={[
        PAGES_TABLE_LABELS.columnTitle,
        PAGES_TABLE_LABELS.columnStatus,
        PAGES_TABLE_LABELS.columnDate,
        PAGES_TABLE_LABELS.columnActions,
      ]}
    >
      {pages.map((page) => (
        <DashboardTableRow key={page.id}>
          <DashboardTableCell className="max-w-[24rem]">
            <div className="flex items-center gap-3">
              {page.coverImage ? (
                <Image
                  src={r2PublicUrl(page.coverImage)}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  unoptimized
                  className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
                />
              ) : (
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border"
                  aria-hidden="true"
                >
                  <FileText className="size-4" />
                </span>
              )}
              <div className="min-w-0">
                {page.status === "PUBLISHED" ? (
                  <Link
                    href={pageHref(page.slug)}
                    target="_blank"
                    className="block truncate rounded-sm text-[13px] font-bold leading-5 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    {page.title}
                  </Link>
                ) : (
                  <span className="block truncate text-[13px] font-bold leading-5 text-foreground">{page.title}</span>
                )}
                <span
                  dir="ltr"
                  className="mt-1 flex min-w-0 items-center gap-1 truncate text-[11px] text-muted-foreground"
                >
                  <FileText className="size-3 shrink-0" aria-hidden="true" />
                  /{page.slug}
                </span>
              </div>
            </div>
          </DashboardTableCell>
          <DashboardTableCell>
            <StatusBadge tone={resolveContentTone(page.status)}>
              {page.status === "PUBLISHED" ? PAGES_TABLE_LABELS.statusPublished : PAGES_TABLE_LABELS.statusDraft}
            </StatusBadge>
          </DashboardTableCell>
          <DashboardTableCell className="whitespace-nowrap">
            <span className="block text-[13px] tabular-nums text-foreground">
              {PAGES_TABLE_LABELS.updatedLabel} {formatFaDate(page.updatedAt)}
            </span>
          </DashboardTableCell>
          <DashboardTableCell>
            <div className="flex items-center gap-1">
              <RowActionButton asChild aria-label={PAGES_TABLE_LABELS.edit} title={PAGES_TABLE_LABELS.edit}>
                <Link href={`/dashboard/pages/${page.slug}/edit`}>
                  <Pencil className="size-4" aria-hidden="true" />
                </Link>
              </RowActionButton>
              <DeletePageButton slug={page.slug} />
            </div>
          </DashboardTableCell>
        </DashboardTableRow>
      ))}
    </DashboardTable>
  );
}
