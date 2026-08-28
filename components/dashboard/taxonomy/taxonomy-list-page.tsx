import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black sm:text-2xl">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
        </div>

        <Button asChild className="h-10 gap-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20">
          <Link href={`${basePath}/new`}>
            {copy.new}
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>

      <form role="search" action={basePath} className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={copy.searchPlaceholder}
          aria-label={copy.searchPlaceholder}
          className="h-11 w-full rounded-xl border border-border bg-card ps-10 pe-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </form>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-black/[0.05]">
          {copy.empty}
        </div>
      ) : (
        <TaxonomyTable kind={kind} rows={rows} />
      )}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-between">
          {currentPage > 1 ? (
            <Link
              href={buildHref(currentPage - 1)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowRight className="size-4" />
              {POSTS_TABLE_LABELS.prevPage}
            </Link>
          ) : (
            <span />
          )}

          <span className="text-[13px] tabular-nums text-muted-foreground">
            {toFaDigits(currentPage)} / {toFaDigits(totalPages)}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={buildHref(currentPage + 1)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {POSTS_TABLE_LABELS.nextPage}
              <ArrowLeft className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
