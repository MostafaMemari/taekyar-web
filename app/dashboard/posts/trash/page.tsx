import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";

import { RestorePostButton, PermanentDeleteButton } from "@/components/dashboard/posts/trash-post-actions";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import {
  DashboardTable,
  DashboardTableCell,
  DashboardTableRow,
} from "@/components/dashboard/shared/dashboard-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { r2PublicUrl } from "@/lib/r2-url";
import { formatFaDate, toFaDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: POSTS_TABLE_LABELS.trashTitle };

export default async function TrashPostsPage() {
  const posts = await prisma.post.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: "desc" },
    include: {
      categories: { orderBy: { id: "asc" }, select: { name: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">
            {POSTS_TABLE_LABELS.trashTitle}
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
            {POSTS_TABLE_LABELS.trashDescription}
          </p>
        </div>

        <Button asChild variant="outline" className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold text-muted-foreground">
          <Link href="/dashboard/posts">
            <ArrowRight className="size-4" aria-hidden="true" />
            {POSTS_TABLE_LABELS.backToPosts}
          </Link>
        </Button>
      </div>

      <Card className="p-0">
        {posts.length === 0 ? (
          <DashboardEmptyState title={POSTS_TABLE_LABELS.trashEmpty} hint={POSTS_TABLE_LABELS.trashEmptyHint} />
        ) : (
          <TrashTable posts={posts} />
        )}
      </Card>
    </div>
  );
}

interface TrashTableProps {
  posts: Array<{
    id: number;
    slug: string;
    title: string;
    coverImage: string | null;
    deletedAt: Date | null;
    categories: Array<{ name: string }>;
    _count: { comments: number };
  }>;
}

function TrashTable({ posts }: TrashTableProps) {
  return (
    <DashboardTable
      minWidth="min-w-[640px]"
      headers={[
        POSTS_TABLE_LABELS.columnTitle,
        POSTS_TABLE_LABELS.columnCategory,
        POSTS_TABLE_LABELS.columnDeleted,
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
                  className="size-10 shrink-0 rounded-lg object-cover opacity-70 ring-1 ring-border/60"
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
                <span className="block truncate text-[13px] font-bold leading-5">{post.title}</span>
                <span
                  dir="ltr"
                  className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground"
                >
                  <FileText className="size-3 shrink-0" aria-hidden="true" />
                  /blog/{post.slug}
                </span>
              </div>
            </div>
          </DashboardTableCell>
          <DashboardTableCell>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-belt-blue" aria-hidden="true" />
              {post.categories.map((category) => category.name).join("، ") || "—"}
            </span>
          </DashboardTableCell>
          <DashboardTableCell className="whitespace-nowrap text-[13px] text-muted-foreground">
            {post.deletedAt ? formatFaDate(post.deletedAt) : "—"}
          </DashboardTableCell>
          <DashboardTableCell className="whitespace-nowrap">
            <span className="inline-flex min-w-6 justify-center rounded-full bg-muted px-2 py-0.5 text-[12px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
              {toFaDigits(post._count.comments)}
            </span>
          </DashboardTableCell>
          <DashboardTableCell className="py-3">
            <div className="flex items-center gap-1">
              <RestorePostButton slug={post.slug} />
              <PermanentDeleteButton slug={post.slug} />
            </div>
          </DashboardTableCell>
        </DashboardTableRow>
      ))}
    </DashboardTable>
  );
}
