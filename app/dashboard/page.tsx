import Link from "next/link";
import { ArrowLeft, FileText, MessagesSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COMMENT_STATUS_META,
  OVERVIEW_LABELS,
} from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { toFaDigits } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const [postsCount, approvedCount, pendingCount, rejectedCount, pendingComments, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.comment.count({ where: { status: "APPROVED" } }),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.comment.count({ where: { status: "REJECTED" } }),
      prisma.comment.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { post: { select: { title: true, slug: true } } },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { slug: true, title: true, date: true },
      }),
    ]);

  const stats = [
    { label: OVERVIEW_LABELS.postsCount, value: postsCount },
    { label: OVERVIEW_LABELS.approvedComments, value: approvedCount },
    { label: OVERVIEW_LABELS.pendingComments, value: pendingCount },
    { label: OVERVIEW_LABELS.rejectedComments, value: rejectedCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black sm:text-2xl">{OVERVIEW_LABELS.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{OVERVIEW_LABELS.description}</p>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ label, value }) => (
          <li key={label}>
            <Card size="sm" className="h-full">
              <CardContent className="pt-1">
                <p className="text-2xl font-black tabular-nums">{toFaDigits(value)}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="size-4 text-primary" />
              {OVERVIEW_LABELS.pendingTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingComments.length === 0 ? (
              <p className="py-4 text-center text-[13px] text-muted-foreground">
                {OVERVIEW_LABELS.emptyPending}
              </p>
            ) : (
              <ul className="space-y-3">
                {pendingComments.map((comment) => (
                  <li key={comment.id} className="rounded-xl bg-muted/50 p-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[13px] font-bold">{comment.author}</span>
                      <Badge
                        variant="secondary"
                        className={COMMENT_STATUS_META[comment.status].badgeClassName}
                      >
                        {COMMENT_STATUS_META[comment.status].label}
                      </Badge>
                      <span className="ms-auto text-[11px] text-muted-foreground">
                        {OVERVIEW_LABELS.onPostSuffix}{" "}
                        <Link
                          href="/dashboard/comments?status=PENDING"
                          className="font-bold text-primary hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-6 text-muted-foreground">
                      {comment.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <Button variant="outline" asChild className="mt-4 h-9 w-full rounded-xl text-[13px] font-bold">
              <Link href="/dashboard/comments">
                {OVERVIEW_LABELS.manageComments}
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              {OVERVIEW_LABELS.recentPostsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/dashboard/posts/${post.slug}/edit`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/60"
                  >
                    <span className="min-w-0 truncate text-[13px] font-bold">{post.title}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{post.date}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <Button asChild className="mt-4 h-9 w-full rounded-xl text-[13px] font-bold shadow-md shadow-primary/20">
              <Link href="/dashboard/posts/new">
                {OVERVIEW_LABELS.newPost}
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
