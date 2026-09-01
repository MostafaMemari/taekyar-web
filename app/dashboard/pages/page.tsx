import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, Pencil, Search } from "lucide-react";

import { DeletePageButton } from "@/components/dashboard/pages/delete-page-button";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import {
  DashboardTable,
  DashboardTableCell,
  DashboardTableRow,
} from "@/components/dashboard/shared/dashboard-table";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{PAGES_TABLE_LABELS.title}</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
            {PAGES_TABLE_LABELS.description}
          </p>
        </div>

        <Button asChild className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15">
          <Link href="/dashboard/pages/new">
            {PAGES_TABLE_LABELS.newPage}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <Card className="p-0">
        <div className="p-3 sm:p-4">
          <form role="search" aria-label={PAGES_TABLE_LABELS.searchLabel} action="/dashboard/pages" className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
            />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={PAGES_TABLE_LABELS.searchPlaceholder}
              aria-label={PAGES_TABLE_LABELS.searchLabel}
              className="h-10 rounded-xl bg-card ps-9 pe-4 text-[13px] placeholder:text-muted-foreground/60"
            />
          </form>
        </div>
        <Separator className="bg-border/60" />

        {pages.length === 0 ? (
          <DashboardEmptyState
            title={PAGES_TABLE_LABELS.empty}
            hint={query ? "جستجوی دیگری را امتحان کنید یا فیلتر را پاک کنید." : PAGES_TABLE_LABELS.emptyHint}
            action={
              query ? (
                <Button variant="outline" asChild className="h-9 rounded-xl px-4 text-[13px] font-bold">
                  <Link href="/dashboard/pages">پاک کردن جستجو</Link>
                </Button>
              ) : (
                <Button asChild className="h-9 rounded-xl px-4 text-[13px] font-bold">
                  <Link href="/dashboard/pages/new">
                    {PAGES_TABLE_LABELS.newPage}
                    <ArrowLeft className="size-4" aria-hidden="true" />
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
      minWidth="min-w-[640px]"
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
                  className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
                />
              ) : (
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/60"
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
                    className="block truncate rounded-sm text-[13px] font-bold leading-5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    {page.title}
                  </Link>
                ) : (
                  <span className="block truncate text-[13px] font-bold leading-5">{page.title}</span>
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
            {page.status === "PUBLISHED" ? (
              <Badge variant="outline" className="h-4.5 border-emerald-300/70 bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-800">
                {PAGES_TABLE_LABELS.statusPublished}
              </Badge>
            ) : (
              <Badge variant="outline" className="h-4.5 border-amber-300/70 bg-amber-50 px-1.5 text-[10px] font-bold text-amber-800">
                {PAGES_TABLE_LABELS.statusDraft}
              </Badge>
            )}
          </DashboardTableCell>
          <DashboardTableCell className="whitespace-nowrap">
            <span className="block text-[13px] text-foreground">{formatFaDate(page.updatedAt)}</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              {PAGES_TABLE_LABELS.updatedLabel} {formatFaDate(page.updatedAt)}
            </span>
          </DashboardTableCell>
          <DashboardTableCell className="py-3">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                aria-label={PAGES_TABLE_LABELS.edit}
                className="size-8 rounded-lg"
              >
                <Link href={`/dashboard/pages/${page.slug}/edit`}>
                  <Pencil className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <DeletePageButton slug={page.slug} />
            </div>
          </DashboardTableCell>
        </DashboardTableRow>
      ))}
    </DashboardTable>
  );
}
