import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { filterCategoryRowsWithAncestors } from "@/lib/blog/categories";
import { prisma } from "@/lib/prisma";

import { TaxonomyTable } from "./taxonomy-table";

const TAXONOMY_PER_PAGE = 10;

interface TaxonomyListPageProps {
  kind: "category" | "tag";
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function TaxonomyListPage({ kind, searchParams }: TaxonomyListPageProps) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const where = query
    ? { OR: [{ name: { contains: query } }, { slug: { contains: query } }] }
    : {};
  const basePath = `/dashboard/${kind === "category" ? "categories" : "tags"}`;
  const copy = TAXONOMY_LABELS.kinds[kind];

  let totalPages = 1;
  let currentPage = 1;

  const categoryRows =
    kind === "category"
      ? filterCategoryRowsWithAncestors(
          await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { posts: true } } },
          }),
          query,
        )
      : [];

  const tagResult =
    kind === "tag"
      ? await (async () => {
          const total = await prisma.tag.count({ where });
          const pageCount = Math.max(1, Math.ceil(total / TAXONOMY_PER_PAGE));
          const pageIndex = Math.min(Math.max(Number(page) || 1, 1), pageCount);
          const rows = await prisma.tag.findMany({
            where,
            orderBy: { name: "asc" },
            include: { _count: { select: { posts: true } } },
            skip: (pageIndex - 1) * TAXONOMY_PER_PAGE,
            take: TAXONOMY_PER_PAGE,
          });
          return { rows, pageCount, pageIndex };
        })()
      : null;

  totalPages = tagResult?.pageCount ?? 1;
  currentPage = tagResult?.pageIndex ?? 1;
  const tagRows = tagResult?.rows ?? [];

  const rows = kind === "category" ? categoryRows : tagRows;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{copy.title}</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
            {copy.description}
          </p>
        </div>

        <Button asChild className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15">
          <Link href={`${basePath}/new`}>
            {copy.new}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <Card className="p-0">
        <div className="p-3 sm:p-4">
          <form role="search" aria-label={copy.searchPlaceholder} action={basePath} className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
            />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
              className="h-10 rounded-xl bg-card ps-9 pe-4 text-[13px] placeholder:text-muted-foreground/60"
            />
          </form>
        </div>
        <Separator className="bg-border/60" />

        {rows.length === 0 ? (
          <DashboardEmptyState
            title={copy.empty}
            hint={
              query
                ? "جستجوی دیگری را امتحان کنید یا فیلتر را پاک کنید."
                : "اولین مورد را بسازید تا فهرست اینجا نمایش داده شود."
            }
            action={
              query ? (
                <Button variant="outline" asChild className="h-9 rounded-xl px-4 text-[13px] font-bold">
                  <Link href={basePath}>پاک کردن جستجو</Link>
                </Button>
              ) : (
                <Button asChild className="h-9 rounded-xl px-4 text-[13px] font-bold">
                  <Link href={`${basePath}/new`}>
                    {copy.new}
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              )
            }
          />
        ) : kind === "category" ? (
          <TaxonomyTable kind="category" rows={categoryRows} />
        ) : (
          <TaxonomyTable kind="tag" rows={tagRows} />
        )}
      </Card>

      {totalPages > 1 ? (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={buildHref}
          labels={{
            prevPage: TAXONOMY_LABELS.prevPage,
            nextPage: TAXONOMY_LABELS.nextPage,
            pageInfoSuffix: TAXONOMY_LABELS.pageInfoSuffix,
            title: TAXONOMY_LABELS.paginationNavLabel,
          }}
        />
      ) : null}
    </div>
  );
}
