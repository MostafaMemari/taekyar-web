import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Inbox } from "lucide-react";

import { RestorePostButton, PermanentDeleteButton } from "@/components/dashboard/posts/trash-post-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
      category: { select: { name: true } },
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
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[14px] font-bold">{POSTS_TABLE_LABELS.trashEmpty}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              {POSTS_TABLE_LABELS.trashEmptyHint}
            </p>
          </CardContent>
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
    category: { name: string } | null;
    _count: { comments: number };
  }>;
}

function TrashTable({ posts }: TrashTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[640px]">
        <TableHeader className="bg-muted/30">
          <TableRow className="border-b border-border/60 hover:bg-transparent">
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnTitle}
            </TableHead>
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnCategory}
            </TableHead>
            <TableHead className="h-10 px-4 text-start text-[12px] font-bold tracking-wide text-muted-foreground">
              {POSTS_TABLE_LABELS.columnDeleted}
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
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-belt-blue" aria-hidden="true" />
                  {post.category?.name ?? "—"}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3.5 text-[13px] text-muted-foreground">
                {post.deletedAt ? formatFaDate(post.deletedAt) : "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-3.5">
                <span className="inline-flex min-w-6 justify-center rounded-full bg-muted px-2 py-0.5 text-[12px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
                  {toFaDigits(post._count.comments)}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <RestorePostButton slug={post.slug} />
                  <PermanentDeleteButton slug={post.slug} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
