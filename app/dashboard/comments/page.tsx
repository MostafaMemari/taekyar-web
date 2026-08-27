import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { CommentActions } from "@/components/dashboard/comments/comment-actions";
import { Badge } from "@/components/ui/badge";
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
        <h1 className="text-xl font-black sm:text-2xl">{COMMENTS_ADMIN_LABELS.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{COMMENTS_ADMIN_LABELS.description}</p>
      </div>

      <nav aria-label={COMMENTS_ADMIN_LABELS.title} className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const href = filter.key ? `/dashboard/comments?status=${filter.key}` : "/dashboard/comments";
          const active = (statusFilter ?? null) === filter.key;

          return (
            <Link
              key={filter.label}
              href={href}
              aria-current={active ? "true" : undefined}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  active ? "bg-white/20" : "bg-muted",
                )}
              >
                {toFaDigits(filter.count)}
              </span>
            </Link>
          );
        })}
      </nav>

      {comments.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-black/[0.05]">
          {COMMENTS_ADMIN_LABELS.empty}
        </div>
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
    <li className="rounded-2xl bg-card p-4 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-5">
      <CommentBody comment={comment} post={comment.post} />

      {comment.replies.length > 0 ? (
        <div className="mt-4 rounded-xl bg-muted/60 p-1.5 sm:p-2.5">
          <p className="px-2 pb-1.5 pt-1 text-[11px] font-bold text-muted-foreground">
            {COMMENTS_ADMIN_LABELS.repliesLabel} ({toFaDigits(comment.replies.length)})
          </p>
          <ul className="space-y-1.5">
            {comment.replies.map((reply) => (
              <li key={reply.id} className="rounded-lg bg-card px-3 py-2.5">
                <CommentBody comment={reply} post={comment.post} isReply />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
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
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {isReply ? (
          <Badge variant="secondary" className="bg-muted text-[10px] text-muted-foreground">
            {COMMENTS_ADMIN_LABELS.replyTag}
          </Badge>
        ) : null}

        <h3
          className={cn(
            "max-w-full truncate text-sm font-extrabold",
            comment.isTeamAuthor && "text-primary",
          )}
        >
          {comment.author}
        </h3>

        <Badge
          variant="secondary"
          className={cn("text-[10px]", COMMENT_STATUS_META[comment.status].badgeClassName)}
        >
          {COMMENT_STATUS_META[comment.status].label}
        </Badge>

        <time className="ms-auto whitespace-nowrap text-[11px] text-muted-foreground">
          {comment.date}
        </time>
      </div>

      <p className="mt-2 text-pretty text-[13.5px] leading-7 text-muted-foreground">
        {comment.message}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.04] pt-2.5">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex min-h-8 items-center gap-1.5 text-[12px] font-bold text-primary hover:underline"
        >
          <ExternalLink className="size-3.5" />
          {COMMENTS_ADMIN_LABELS.onPost}: {post.title}
        </Link>

        <CommentActions id={comment.id} status={comment.status} />
      </div>
    </div>
  );
}
