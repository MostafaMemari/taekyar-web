import Link from "next/link";
import Image from "next/image";
import { FileText, Pencil, Trash2 } from "lucide-react";

import { TrashPostButton } from "@/components/dashboard/posts/trash-post-button";
import { DashboardCountChip, DashboardSearchField, DashboardToolbar } from "@/components/dashboard/shared/dashboard-toolbar";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import {
  DashboardTable,
  DashboardTableCell,
  DashboardTableRow,
} from "@/components/dashboard/shared/dashboard-table";
import { ForwardIcon } from "@/components/dashboard/shared/directional-icons";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { RowActionButton } from "@/components/dashboard/shared/row-action-button";
import { resolveContentTone, StatusBadge } from "@/components/dashboard/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      categories: { orderBy: { id: "asc" }, select: { name: true } },
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
      <DashboardPageHeader
        title={POSTS_TABLE_LABELS.title}
        description={POSTS_TABLE_LABELS.description}
        actions={
          <>
            <Button
              asChild
              variant="outline"
              className="h-10 gap-2 rounded-lg border-border px-4 text-[13px] font-bold text-muted-foreground"
            >
              <Link href="/dashboard/posts/trash">
                <Trash2 className="size-4" aria-hidden="true" />
                {POSTS_TABLE_LABELS.trash}
              </Link>
            </Button>
            <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
              <Link href="/dashboard/posts/new">
                {POSTS_TABLE_LABELS.newPost}
                <ForwardIcon className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      <Card className="gap-0 rounded-xl p-0 shadow-none">
        <DashboardToolbar>
          <DashboardSearchField
            action="/dashboard/posts"
            label={POSTS_TABLE_LABELS.searchLabel}
            placeholder={POSTS_TABLE_LABELS.searchPlaceholder}
            defaultValue={query}
          />
          <DashboardCountChip count={total} suffix={POSTS_TABLE_LABELS.resultsSuffix} />
        </DashboardToolbar>

        {posts.length === 0 ? (
          <DashboardEmptyState
            title={POSTS_TABLE_LABELS.empty}
            hint={query ? "جستجوی دیگری را امتحان کنید یا فیلتر را پاک کنید." : "اولین مقاله را بسازید تا فهرست اینجا پر شود."}
            action={
              query ? (
                <Button variant="outline" asChild className="h-10 rounded-lg px-4 text-[13px] font-bold">
                  <Link href="/dashboard/posts">پاک کردن جستجو</Link>
                </Button>
              ) : (
                <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
                  <Link href="/dashboard/posts/new">
                    {POSTS_TABLE_LABELS.newPost}
                    <ForwardIcon className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              )
            }
          />
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
    categories: Array<{ name: string }>;
    createdAt: Date;
    updatedAt: Date;
    _count: { comments: number };
  }>;
}

function PostsTable({ posts }: PostsTableProps) {
  return (
    <DashboardTable
      caption={POSTS_TABLE_LABELS.title}
      minWidth="min-w-[760px]"
      hiddenOnMobile={[2, 4]}
      headers={[
        POSTS_TABLE_LABELS.columnTitle,
        POSTS_TABLE_LABELS.columnCategory,
        POSTS_TABLE_LABELS.columnDate,
        POSTS_TABLE_LABELS.columnComments,
        POSTS_TABLE_LABELS.columnActions,
      ]}
    >
      {posts.map((post) => (
        <DashboardTableRow key={post.id}>
          <DashboardTableCell className="max-w-[22rem]">
            <div className="flex items-center gap-3">
              {post.coverImage ? (
                <Image
                  src={r2PublicUrl(post.coverImage)}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  unoptimized
                  className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
                />
              ) : (
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-muted-foreground ring-1 ring-border"
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
                    className="block truncate rounded-sm text-[13px] font-bold leading-5 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    {post.title}
                  </Link>
                ) : (
                  <span className="block truncate text-[13px] font-bold leading-5 text-foreground">{post.title}</span>
                )}
                <span className="mt-1 flex items-center gap-1.5">
                  {post.status === "DRAFT" ? (
                    <StatusBadge tone={resolveContentTone(post.status)}>{POSTS_TABLE_LABELS.statusDraft}</StatusBadge>
                  ) : null}
                  <span dir="ltr" className="flex min-w-0 items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <FileText className="size-3 shrink-0" aria-hidden="true" />
                    /blog/{post.slug}
                  </span>
                </span>
              </div>
            </div>
          </DashboardTableCell>
          <DashboardTableCell>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
              {post.categories.map((category) => category.name).join("، ") || "—"}
            </span>
          </DashboardTableCell>
          <DashboardTableCell className="whitespace-nowrap">
            <span className="block text-[13px] tabular-nums text-foreground">{formatFaDate(post.createdAt)}</span>
            <span className="mt-0.5 block text-[11px] tabular-nums text-muted-foreground">
              {POSTS_TABLE_LABELS.updatedLabel} {formatFaDate(post.updatedAt)}
            </span>
          </DashboardTableCell>
          <DashboardTableCell className="whitespace-nowrap">
            <span className="inline-flex min-w-7 justify-center rounded-md border border-border bg-muted px-2 py-0.5 text-[12px] font-semibold tabular-nums text-muted-foreground">
              {toFaDigits(post._count.comments)}
            </span>
          </DashboardTableCell>
          <DashboardTableCell>
            <div className="flex items-center gap-1">
              <RowActionButton
                asChild
                aria-label={POSTS_TABLE_LABELS.edit}
                title={POSTS_TABLE_LABELS.edit}
              >
                <Link href={`/dashboard/posts/${post.slug}/edit`}>
                  <Pencil className="size-4" aria-hidden="true" />
                </Link>
              </RowActionButton>
              <TrashPostButton slug={post.slug} />
            </div>
          </DashboardTableCell>
        </DashboardTableRow>
      ))}
    </DashboardTable>
  );
}
