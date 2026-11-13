import Link from "next/link";

import { ForwardIcon } from "@/components/dashboard/shared/directional-icons";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import {
  DashboardCountChip,
  DashboardSearchField,
  DashboardToolbar,
} from "@/components/dashboard/shared/dashboard-toolbar";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
          return { rows, pageCount, pageIndex, total };
        })()
      : null;

  totalPages = tagResult?.pageCount ?? 1;
  currentPage = tagResult?.pageIndex ?? 1;
  const tagRows = tagResult?.rows ?? [];

  const rows = kind === "category" ? categoryRows : tagRows;
  const total = kind === "category" ? categoryRows.length : (tagResult?.total ?? 0);

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
            <Link href={`${basePath}/new`}>
              {copy.new}
              <ForwardIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <Card className="gap-0 rounded-xl p-0 shadow-none">
        <DashboardToolbar>
          <DashboardSearchField
            action={basePath}
            label={copy.searchPlaceholder}
            placeholder={copy.searchPlaceholder}
            defaultValue={query}
          />
          <DashboardCountChip count={total} suffix={copy.resultsSuffix} />
        </DashboardToolbar>

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
                <Button variant="outline" asChild className="h-10 rounded-lg px-4 text-[13px] font-bold">
                  <Link href={basePath}>پاک کردن جستجو</Link>
                </Button>
              ) : (
                <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
                  <Link href={`${basePath}/new`}>
                    {copy.new}
                    <ForwardIcon className="size-4" aria-hidden="true" />
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
          total={total}
          buildHref={buildHref}
          labels={{
            prevPage: TAXONOMY_LABELS.prevPage,
            nextPage: TAXONOMY_LABELS.nextPage,
            pageInfoSuffix: TAXONOMY_LABELS.pageInfoSuffix,
            title: TAXONOMY_LABELS.paginationNavLabel,
            resultsSuffix: copy.resultsSuffix,
          }}
        />
      ) : null}
    </div>
  );
}
