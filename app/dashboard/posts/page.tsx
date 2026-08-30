import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, Inbox, Pencil, Search, Trash2 } from "lucide-react";

import { TrashPostButton } from "@/components/dashboard/posts/trash-post-button";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { postHref } from "@/lib/routes";
import { r2PublicUrl } from "@/lib/r2-url";
import { formatFaDate, toFaDigits } from "@/lib/utils";

interface PostsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const POSTS_PER_PAGE = 10;

export default async function DashboardPostsPage({ searchParams }: PostsPageProps) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const where = query
    ? { deletedAt: null, OR: [{ title: { contains: query } }, { slug: { contains: query } }] }
    : { deletedAt: null };

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
  });  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `/dashboard/posts?${queryString}` : "/dashboard/posts";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{POSTS_TABLE_LABELS.title}</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
            {POSTS_TABLE_LABELS.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold text-muted-foreground"
          >
            <Link href="/dashboard/posts/trash">
              <Trash2 className="size-4" aria-hidden="true" />
              {POSTS_TABLE_LABELS.trash}
            </Link>
          </Button>
          <Button asChild className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15">
            <Link href="/dashboard/posts/new">
              {POSTS_TABLE_LABELS.newPost}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <div className="p-3 sm:p-4">
          <form role="search" aria-label={POSTS_TABLE_LABELS.searchLabel} action="/dashboard/posts" className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
            />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={POSTS_TABLE_LABELS.searchPlaceholder}
              aria-label={POSTS_TABLE_LABELS.searchLabel}
              className="h-10 rounded-xl bg-card ps-9 pe-4 text-[13px] placeholder:text-muted-foreground/60"
            />
          </form>
        </div>
        <Separator className="bg-border/60" />

        {posts.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[14px] font-bold">{POSTS_TABLE_LABELS.empty}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              {query ? "جستجوی دیگری را امتحان کنید یا فیلتر را پاک کنید." : "اولین مقاله را بسازید تا فهرست اینجا پر شود."}
            </p>
            {query ? (
              <Button variant="outline" asChild className="mt-4 h-9 rounded-xl px-4 text-[13px] font-bold">
                <Link href="/dashboard/posts">پاک کردن جستجو</Link>
              </Button>
            ) : (
              <Button asChild className="mt-4 h-9 rounded-xl px-4 text-[13px] font-bold">
                <Link href="/dashboard/posts/new">
                  {POSTS_TABLE_LABELS.newPost}
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
          </CardContent>
        ) : (
          <PostsTable posts={posts} />
        )}
      </Card>

      {totalPages > 1 ? (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          buildHref={buildHref}
          labels={POSTS_TABLE_LABELS}
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
    coverImage: string | null;
    status: "DRAFT" | "PUBLISHED";
    category: { name: string };
    createdAt: Date;
    updatedAt: Date;
    _count: { comments: number };
  }>;
}

function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[720px]">
        <TableHeader className="bg-muted/30">
          <TableRow className="border-b border-border/60 hover:bg-transparent">
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnTitle}
            </TableHead>
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnCategory}
            </TableHead>
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnDate}
            </TableHead>
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnComments}
            </TableHead>
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnActions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              className="border-b border-border/40 last:border-0 hover:bg-muted/30 motion-reduce:transition-none"
            >
              <TableCell className="max-w-[22rem] px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {post.coverImage ? (
                    <Image
                      src={r2PublicUrl(post.coverImage)}
                      alt=""
                      aria-hidden="true"
                      width={40}
                      height={40}
                      unoptimized
                      className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
                    />
                  ) : (
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-black text-muted-foreground ring-1 ring-border/60"
                      aria-hidden="true"
                    >
                      {post.title.trim().charAt(0) || "—"}
                    </span>
                  )}
                  <div className="min-w-0">
                    {post.status === "PUBLISHED" ? (
                      <Link
                        href={postHref(post.slug)}
                        target="_blank"
                        className="block truncate text-[13px] font-bold leading-5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm"
                      >
                        {post.title}
                      </Link>
                    ) : (
                      <span className="block truncate text-[13px] font-bold leading-5">{post.title}</span>
                    )}
                    <span className="mt-1 flex items-center gap-1.5">
                      {post.status === "DRAFT" ? (
                        <Badge variant="outline" className="h-4.5 border-amber-300/70 bg-amber-50 px-1.5 text-[10px] font-bold text-amber-800">
                          {POSTS_TABLE_LABELS.statusDraft}
                        </Badge>
                      ) : null}
                      <span
                        dir="ltr"
                        className="flex min-w-0 items-center gap-1 truncate text-[11px] text-muted-foreground"
                      >
                        <FileText className="size-3 shrink-0" aria-hidden="true" />
                        /blog/{post.slug}
                      </span>
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-belt-blue" aria-hidden="true" />
                  {post.category.name}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3.5">
                <span className="block text-[13px] text-foreground">{formatFaDate(post.createdAt)}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {POSTS_TABLE_LABELS.updatedLabel} {formatFaDate(post.updatedAt)}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3.5">
                <span className="inline-flex min-w-6 justify-center rounded-full bg-muted px-2 py-0.5 text-[12px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
                  {toFaDigits(post._count.comments)}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    aria-label={POSTS_TABLE_LABELS.edit}
                    className="size-8 rounded-lg"
                  >
                    <Link href={`/dashboard/posts/${post.slug}/edit`}>
                      <Pencil className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <TrashPostButton slug={post.slug} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
