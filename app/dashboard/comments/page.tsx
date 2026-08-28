import Link from "next/link";
import { ExternalLink, Inbox } from "lucide-react";

import { CommentActions } from "@/components/dashboard/comments/comment-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CommentStatus } from "@/lib/admin-types";
import { COMMENT_STATUS_META, COMMENTS_ADMIN_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { cn, toFaDigits } from "@/lib/utils";

const STATUS_FILTERS: CommentStatus[] = ["PENDING", "APPROVED", "REJECTED"];

interface CommentEntry {
  id: string;
  author: string;
  role: string;
  isTeamAuthor: boolean;
  date: string;
  message: string;
  status: CommentStatus;
}

interface CommentRow extends CommentEntry {
  post: { title: string; slug: string };
  replies: CommentEntry[];
}

interface CommentsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function DashboardCommentsPage({ searchParams }: CommentsPageProps) {
  const { status } = await searchParams;
  const statusFilter = STATUS_FILTERS.find((candidate) => candidate === status);

  const [counts, comments] = await Promise.all([
    prisma.comment.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.comment.findMany({
      where: { parentId: null, ...(statusFilter ? { status: statusFilter } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        post: { select: { title: true, slug: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          ...(statusFilter ? { where: { status: statusFilter } } : {}),
        },
      },
    }),
  ]);

  const countByStatus = new Map(counts.map((entry) => [entry.status, entry._count._all]));
  const totalCount = STATUS_FILTERS.reduce((sum, key) => sum + (countByStatus.get(key) ?? 0), 0);

  const filters = [
    { key: null, label: COMMENTS_ADMIN_LABELS.filterAll, count: totalCount },
    ...STATUS_FILTERS.map((key) => ({
      key,
      label: COMMENT_STATUS_META[key].label,
      count: countByStatus.get(key) ?? 0,
    })),
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-black tracking-tight sm:text-2xl">{COMMENTS_ADMIN_LABELS.title}</h1>
        <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
          {COMMENTS_ADMIN_LABELS.description}
        </p>
      </div>

      <Card className="p-3">
        <nav aria-label={COMMENTS_ADMIN_LABELS.title} className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const href = filter.key ? `/dashboard/comments?status=${filter.key}` : "/dashboard/comments";
            const active = (statusFilter ?? null) === filter.key;

            return (
              <Link
                key={filter.label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
                  active
                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ring-1",
                    active ? "bg-white/20 ring-white/20" : "bg-muted ring-border/60",
                  )}
                >
                  {toFaDigits(filter.count)}
                </span>
              </Link>
            );
          })}
        </nav>
      </Card>

      {comments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
              <Inbox className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[14px] font-bold">{COMMENTS_ADMIN_LABELS.empty}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              دیدگاهی با این فیلتر یافت نشد — فیلتر را تغییر دهید یا منتظر دیدگاه جدید باشید.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3.5">
          {comments.map((comment) => (
            <CommentRowItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CommentRowItem({ comment }: { comment: CommentRow }) {
  return (
    <li>
      <Card className="overflow-hidden shadow-sm shadow-black/[0.03]">
        <CardContent className="p-4 sm:p-5">
          <CommentBody comment={comment} post={comment.post} />

          {comment.replies.length > 0 ? (
            <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-2 sm:p-3">
              <p className="px-1 pb-2 text-[11px] font-bold tracking-wide text-muted-foreground">
                {COMMENTS_ADMIN_LABELS.repliesLabel} · {toFaDigits(comment.replies.length)} پاسخ
              </p>
              <ul className="space-y-2">
                {comment.replies.map((reply) => (
                  <li
                    key={reply.id}
                    className="rounded-xl border border-border/60 bg-card px-3 py-3 shadow-sm shadow-black/[0.02]"
                  >
                    <CommentBody comment={reply} post={comment.post} isReply />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </li>
  );
}

function CommentBody({
  comment,
  post,
  isReply = false,
}: {
  comment: CommentEntry;
  post: { title: string; slug: string };
  isReply?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {isReply ? (
          <Badge variant="secondary" className="rounded-full bg-muted px-2 text-[10px] font-bold text-muted-foreground ring-1 ring-border/60">
            {COMMENTS_ADMIN_LABELS.replyTag}
          </Badge>
        ) : null}

        <h3
          className={cn(
            "max-w-full truncate text-[13px] font-black leading-5",
            comment.isTeamAuthor && "text-primary",
          )}
        >
          {comment.author}
        </h3>

        <Badge
          variant="secondary"
          className={cn(
            "rounded-full px-2 py-0 text-[11px] font-bold ring-1",
            COMMENT_STATUS_META[comment.status].badgeClassName,
          )}
        >
          {COMMENT_STATUS_META[comment.status].label}
        </Badge>

        <time className="ms-auto whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground ring-1 ring-border/60">
          {comment.date}
        </time>
      </div>

      <p className="mt-3 text-pretty text-[13.5px] leading-7 text-foreground/80">
        {comment.message}
      </p>

      <Separator className="my-3 bg-border/60" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 text-[12px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
        >
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {COMMENTS_ADMIN_LABELS.onPost}: {post.title}
          </span>
        </Link>

        <CommentActions id={comment.id} status={comment.status} />
      </div>
    </div>
  );
}
