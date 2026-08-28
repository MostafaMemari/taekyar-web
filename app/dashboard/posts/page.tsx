import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Search } from "lucide-react";

import { DeletePostButton } from "@/components/dashboard/posts/delete-post-button";
import { Button } from "@/components/ui/button";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { toFaDigits } from "@/lib/utils";

interface PostsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const POSTS_PER_PAGE = 10;

export default async function DashboardPostsPage({ searchParams }: PostsPageProps) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const where = query
    ? { OR: [{ title: { contains: query } }, { slug: { contains: query } }] }
    : {};

  const total = await prisma.post.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true } },
      category: { select: { name: true } },
    },
    skip: (currentPage - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
  });

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `/dashboard/posts?${queryString}` : "/dashboard/posts";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-black sm:text-2xl">{POSTS_TABLE_LABELS.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{POSTS_TABLE_LABELS.description}</p>
        </div>

        <Button asChild className="h-10 gap-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20">
          <Link href="/dashboard/posts/new">
            {POSTS_TABLE_LABELS.newPost}
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>

      <form
        role="search"
        aria-label={POSTS_TABLE_LABELS.searchLabel}
        action="/dashboard/posts"
        className="relative"
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={POSTS_TABLE_LABELS.searchPlaceholder}
          aria-label={POSTS_TABLE_LABELS.searchLabel}
          className="h-11 w-full rounded-xl border border-border bg-card ps-10 pe-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </form>

      {posts.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-black/[0.05]">
          {POSTS_TABLE_LABELS.empty}
        </div>
      ) : (
        <PostsTable posts={posts} />
      )}

      {totalPages > 1 ? (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          buildHref={buildHref}
        />
      ) : null}
    </div>
  );
}

interface PostsTableProps {
  posts: Array<{
    id: number;
    slug: string;
    title: string;
    category: { name: string };
    date: string;
    _count: { comments: number };
  }>;
}

function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-start font-bold">{POSTS_TABLE_LABELS.columnTitle}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">{POSTS_TABLE_LABELS.columnCategory}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">{POSTS_TABLE_LABELS.columnDate}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">{POSTS_TABLE_LABELS.columnComments}</th>
              <th scope="col" className="px-4 py-3 text-start font-bold">{POSTS_TABLE_LABELS.columnActions}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-black/[0.04] transition-colors last:border-b-0 hover:bg-muted/40"
              >
                <td className="max-w-[22rem] px-4 py-3">
                  <Link
                    href={`/dashboard/posts/${post.slug}/edit`}
                    className="block truncate font-bold hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <span dir="ltr" className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    /blog/{post.slug}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted-foreground">{post.category.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[13px] text-muted-foreground">{post.date}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[13px] tabular-nums text-muted-foreground">
                  {toFaDigits(post._count.comments)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" asChild aria-label={POSTS_TABLE_LABELS.edit}>
                      <Link href={`/dashboard/posts/${post.slug}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <DeletePostButton slug={post.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  total: number;
  buildHref: (page: number) => string;
}

function PaginationNav({ currentPage, totalPages, total, buildHref }: PaginationNavProps) {
  return (
    <nav className="flex items-center justify-between" aria-label={POSTS_TABLE_LABELS.title}>
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
        {toFaDigits(currentPage)} / {toFaDigits(totalPages)} {POSTS_TABLE_LABELS.pageInfoSuffix} ·{" "}
        {toFaDigits(total)} {POSTS_TABLE_LABELS.resultsSuffix}
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
  );
}
