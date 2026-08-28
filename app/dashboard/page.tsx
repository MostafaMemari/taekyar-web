import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Inbox,
  MessagesSquare,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { COMMENT_STATUS_META, OVERVIEW_LABELS } from "@/data/dashboard/ui";
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
    {
      label: OVERVIEW_LABELS.postsCount,
      value: postsCount,
      icon: FileText,
      tint: "border-t-belt-blue bg-belt-blue/[0.04]",
      iconClass: "bg-belt-blue/10 text-belt-blue ring-belt-blue/15",
    },
    {
      label: OVERVIEW_LABELS.approvedComments,
      value: approvedCount,
      icon: CheckCircle2,
      tint: "border-t-belt-green bg-belt-green/[0.04]",
      iconClass: "bg-belt-green/10 text-belt-green ring-belt-green/15",
    },
    {
      label: OVERVIEW_LABELS.pendingComments,
      value: pendingCount,
      icon: Clock3,
      tint: "border-t-belt-yellow bg-belt-yellow/[0.06]",
      iconClass: "bg-belt-yellow/15 text-belt-yellow-fg ring-belt-yellow/20",
    },
    {
      label: OVERVIEW_LABELS.rejectedComments,
      value: rejectedCount,
      icon: XCircle,
      tint: "border-t-belt-red bg-belt-red/[0.04]",
      iconClass: "bg-belt-red/10 text-belt-red ring-belt-red/15",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{OVERVIEW_LABELS.title}</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
            {OVERVIEW_LABELS.description}
          </p>
        </div>
        <Button asChild className="h-9 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15">
          <Link href="/dashboard/posts/new">
            {OVERVIEW_LABELS.newPost}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ label, value, icon: Icon, tint, iconClass }) => (
          <li key={label}>
            <Card
              size="sm"
              className={`relative h-full overflow-hidden border-t-[3px] ${tint} shadow-sm shadow-black/[0.04] transition-colors hover:shadow-md motion-reduce:transition-none`}
            >
              <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0 opacity-[0.035]" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl border text-sm ring-1 ${iconClass}`}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-card px-2 py-1 text-[10px] font-bold tracking-widest text-muted-foreground ring-1 ring-border/60">
                    {label === OVERVIEW_LABELS.pendingComments && pendingCount > 0 ? "نیاز به بررسی" : "به‌روز"}
                  </span>
                </div>
                <p className="mt-3 text-[28px] font-black leading-none tabular-nums tracking-tight">
                  {toFaDigits(value)}
                </p>
                <p className="mt-1.5 text-xs font-bold leading-4 text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Card className="overflow-hidden">
          <CardHeader className="gap-0 pb-0">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2.5 text-[14px] font-black">
                <span className="flex size-8 items-center justify-center rounded-lg bg-belt-yellow/15 text-belt-yellow-fg ring-1 ring-belt-yellow/20">
                  <MessagesSquare className="size-4" aria-hidden="true" />
                </span>
                {OVERVIEW_LABELS.pendingTitle}
              </CardTitle>
              <Badge variant="secondary" className="rounded-full bg-belt-yellow/15 px-2.5 text-[11px] font-bold tabular-nums text-belt-yellow-fg ring-belt-yellow/20">
                {toFaDigits(pendingCount)} در انتظار
              </Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              دیدگاه‌هایی که پیش از انتشار نیاز به تأیید دارند
            </p>
            <Separator className="mt-4 bg-border/60" />
          </CardHeader>
          <CardContent className="pt-4">
            {pendingComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border">
                  <Inbox className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[13px] font-bold">{OVERVIEW_LABELS.emptyPending}</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                  همه دیدگاه‌ها بررسی شده‌اند — مورد جدیدی در صف نیست.
                </p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {pendingComments.map((comment) => (
                  <li
                    key={comment.id}
                    className="group rounded-xl border border-border/60 bg-card p-3 shadow-sm shadow-black/[0.03] transition-colors hover:bg-muted/40 motion-reduce:transition-none"
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[13px] font-bold leading-5">{comment.author}</span>
                      <Badge
                        variant="secondary"
                        className={COMMENT_STATUS_META[comment.status].badgeClassName + " rounded-full px-2 py-0 text-[11px] font-bold"}
                      >
                        {COMMENT_STATUS_META[comment.status].label}
                      </Badge>
                      <span className="ms-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                        {OVERVIEW_LABELS.onPostSuffix}
                        <Link
                          href="/dashboard/comments?status=PENDING"
                          className="max-w-[14ch] truncate font-bold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm"
                        >
                          {comment.post.title}
                        </Link>
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted-foreground">
                      {comment.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <Button
              variant="outline"
              asChild
              className="mt-4 h-10 w-full justify-between rounded-xl border-border/60 px-4 text-[13px] font-bold hover:bg-muted/60 motion-reduce:transition-none"
            >
              <Link href="/dashboard/comments">
                {OVERVIEW_LABELS.manageComments}
                <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="gap-0 pb-0">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2.5 text-[14px] font-black">
                <span className="flex size-8 items-center justify-center rounded-lg bg-belt-blue/10 text-belt-blue ring-1 ring-belt-blue/15">
                  <FileText className="size-4" aria-hidden="true" />
                </span>
                {OVERVIEW_LABELS.recentPostsTitle}
              </CardTitle>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
                {toFaDigits(recentPosts.length)} مقاله
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              آخرین محتوای منتشرشده — برای ویرایش سریع انتخاب کنید
            </p>
            <Separator className="mt-4 bg-border/60" />
          </CardHeader>
          <CardContent className="pt-3">
            {recentPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[13px] font-bold">هنوز مقاله‌ای نیست</p>
                <p className="mt-1 text-xs text-muted-foreground">اولین مقاله را بسازید تا اینجا نمایش داده شود.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
                {recentPosts.map((post) => (
                  <li key={post.slug} className="group bg-card">
                    <Link
                      href={`/dashboard/posts/${post.slug}/edit`}
                      className="flex items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset motion-reduce:transition-none"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold leading-5 group-hover:text-primary">{post.title}</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{post.date}</p>
                      </div>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition-all group-hover:opacity-100 motion-reduce:transition-none">
                        <ArrowLeft className="size-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Button
              asChild
              className="mt-4 h-10 w-full justify-between rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15 hover:bg-primary/90 motion-reduce:transition-none"
            >
              <Link href="/dashboard/posts/new">
                {OVERVIEW_LABELS.newPost}
                <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
