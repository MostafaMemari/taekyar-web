import Link from "next/link";
import { Activity, FileText, MessagesSquare } from "lucide-react";

import { ActivityChart } from "@/components/dashboard/overview/activity-chart";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { DashboardSection } from "@/components/dashboard/shared/dashboard-section";
import { ForwardIcon } from "@/components/dashboard/shared/directional-icons";
import { StatCard } from "@/components/dashboard/shared/stat-card";
import { resolveCommentTone, StatusBadge } from "@/components/dashboard/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  COMMENT_STATUS_META,
  OVERVIEW_ACTIVITY_WEEKS,
  OVERVIEW_LABELS,
  OVERVIEW_PENDING_LIMIT,
  OVERVIEW_RECENT_POSTS_LIMIT,
  OVERVIEW_STAT_CARDS,
} from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { buildWeeklyActivityBuckets, getActivityWindowStart } from "@/lib/dashboard-activity";
import { formatFaDate } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const activityStart = getActivityWindowStart(OVERVIEW_ACTIVITY_WEEKS);

  const [postsCount, approvedCount, pendingCount, rejectedCount, pendingComments, recentPosts, activityComments] =
    await Promise.all([
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.comment.count({ where: { status: "APPROVED" } }),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.comment.count({ where: { status: "REJECTED" } }),
      prisma.comment.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: OVERVIEW_PENDING_LIMIT,
        include: { post: { select: { title: true, slug: true } } },
      }),
      prisma.post.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: OVERVIEW_RECENT_POSTS_LIMIT,
        select: { slug: true, title: true, createdAt: true },
      }),
      prisma.comment.findMany({
        where: { createdAt: { gte: activityStart } },
        select: { createdAt: true },
      }),
    ]);

  const statValues: Record<(typeof OVERVIEW_STAT_CARDS)[number]["key"], number> = {
    posts: postsCount,
    approved: approvedCount,
    pending: pendingCount,
    rejected: rejectedCount,
  };

  const buckets = buildWeeklyActivityBuckets(activityComments, OVERVIEW_ACTIVITY_WEEKS);
  const activityTotal = buckets.reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={OVERVIEW_LABELS.title}
        description={OVERVIEW_LABELS.description}
        actions={
          <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
            <Link href="/dashboard/posts/new">
              {OVERVIEW_LABELS.newPost}
              <ForwardIcon className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {OVERVIEW_STAT_CARDS.map(({ key, label, icon: Icon, tone, href }) => (
          <li key={key}>
            <StatCard label={label} value={statValues[key]} Icon={Icon} tone={tone} href={href} />
          </li>
        ))}
      </ul>

      <DashboardSection title={OVERVIEW_LABELS.activityTitle} description={OVERVIEW_LABELS.activityHint} Icon={Activity}>
        <ActivityChart buckets={buckets} total={activityTotal} />
      </DashboardSection>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <DashboardSection
          title={OVERVIEW_LABELS.pendingTitle}
          description={OVERVIEW_LABELS.pendingHint}
          Icon={MessagesSquare}
          action={
            <Button
              variant="ghost"
              asChild
              className="h-9 gap-1.5 rounded-lg px-2.5 text-[13px] font-bold text-muted-foreground hover:text-foreground"
            >
              <Link href="/dashboard/comments?status=PENDING">
                {OVERVIEW_LABELS.manageComments}
                <ForwardIcon className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          {pendingComments.length === 0 ? (
            <DashboardEmptyState title={OVERVIEW_LABELS.emptyPending} hint={OVERVIEW_LABELS.emptyPendingHint} />
          ) : (
            <ul className="space-y-2">
              {pendingComments.map((comment) => (
                <li key={comment.id} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[13px] font-bold leading-5 text-foreground">{comment.author}</span>
                    <StatusBadge tone={resolveCommentTone(comment.status)}>
                      {COMMENT_STATUS_META[comment.status].label}
                    </StatusBadge>
                    <span className="ms-auto flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
                      {OVERVIEW_LABELS.onPostSuffix}
                      <Link
                        href="/dashboard/comments?status=PENDING"
                        className="max-w-40 truncate rounded-sm font-bold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {comment.post.title}
                      </Link>
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted-foreground">{comment.message}</p>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        <DashboardSection
          title={OVERVIEW_LABELS.recentPostsTitle}
          description={OVERVIEW_LABELS.recentPostsHint}
          Icon={FileText}
          action={
            <Button
              variant="ghost"
              asChild
              className="h-9 gap-1.5 rounded-lg px-2.5 text-[13px] font-bold text-muted-foreground hover:text-foreground"
            >
              <Link href="/dashboard/posts">
                {OVERVIEW_LABELS.viewAllPosts}
                <ForwardIcon className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          {recentPosts.length === 0 ? (
            <DashboardEmptyState
              title={OVERVIEW_LABELS.emptyPosts}
              hint={OVERVIEW_LABELS.emptyPostsHint}
              icon={<FileText className="size-6" aria-hidden="true" />}
              action={
                <Button asChild className="h-10 gap-2 rounded-lg px-4 text-[13px] font-bold">
                  <Link href="/dashboard/posts/new">
                    {OVERVIEW_LABELS.newPost}
                    <ForwardIcon className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/dashboard/posts/${post.slug}/edit`}
                    className="group flex items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset motion-reduce:transition-none"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold leading-5 text-foreground group-hover:text-primary">
                        {post.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-4 tabular-nums text-muted-foreground">
                        {formatFaDate(post.createdAt)}
                      </span>
                    </span>
                    <ForwardIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>
    </div>
  );
}
