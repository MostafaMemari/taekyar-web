import Link from "next/link";
import { ArrowLeft, ArrowRight, Inbox, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { POSTS_TABLE_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { toFaDigits } from "@/lib/utils";

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

  const total =
    kind === "category"
      ? await prisma.category.count({ where })
      : await prisma.tag.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / TAXONOMY_PER_PAGE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const args = {
    where,
    orderBy: { name: "asc" as const },
    include: { _count: { select: { posts: true } } },
    skip: (currentPage - 1) * TAXONOMY_PER_PAGE,
    take: TAXONOMY_PER_PAGE,
  };

  const rows =
    kind === "category"
      ? await prisma.category.findMany(args)
      : await prisma.tag.findMany(args);

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
          <form role="search" action={basePath} className="relative">
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
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[14px] font-bold">{copy.empty}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              {query ? "جستجوی دیگری را امتحان کنید یا فیلتر را پاک کنید." : "اولین مورد را بسازید تا فهرست اینجا نمایش داده شود."}
            </p>
            {query ? (
              <Button variant="outline" asChild className="mt-4 h-9 rounded-xl px-4 text-[13px] font-bold">
                <Link href={basePath}>پاک کردن جستجو</Link>
              </Button>
            ) : (
              <Button asChild className="mt-4 h-9 rounded-xl px-4 text-[13px] font-bold">
                <Link href={`${basePath}/new`}>
                  {copy.new}
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </CardContent>
        ) : (
          <TaxonomyTable kind={kind} rows={rows} />
        )}
      </Card>

      {totalPages > 1 ? (
        <nav
          className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-2 py-2 shadow-sm shadow-black/[0.03]"
          aria-label="صفحه‌بندی"
        >
          {currentPage > 1 ? (
            <Link
              href={buildHref(currentPage - 1)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
              {POSTS_TABLE_LABELS.prevPage}
            </Link>
          ) : (
            <span className="min-h-8 px-3" aria-hidden="true" />
          )}

          <span className="rounded-full bg-muted px-3 py-1 text-[13px] font-medium tabular-nums text-muted-foreground ring-1 ring-border/60">
            {toFaDigits(currentPage)} / {toFaDigits(totalPages)}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={buildHref(currentPage + 1)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {POSTS_TABLE_LABELS.nextPage}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="min-h-8 px-3" aria-hidden="true" />
          )}
        </nav>
      ) : null}
    </div>
  );
}
