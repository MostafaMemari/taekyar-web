import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { CATEGORY_STYLES } from "@/components/blog/data";
import { PostCover } from "@/components/blog/post-cover";
import { POST_LABELS } from "@/components/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import { toFaDigits } from "@/lib/utils";

function AuthorBadge() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-belt-black text-sm font-black text-white"
      >
        ت
      </span>
      <span className="flex flex-col leading-5">
        <span className="text-[13px] font-bold text-foreground">{POST_LABELS.author}</span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {POST_LABELS.authorRole}
        </span>
      </span>
    </span>
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-80"
        style={{ backgroundColor: `${color}14`, color }}
      >
        <Icon className="size-3.5" />
        {post.category}
      </Link>

      <AuthorBadge />

      <span className="h-8 w-px max-sm:hidden" aria-hidden="true" />

      <span className="flex flex-col gap-y-1 sm:flex-row sm:items-center sm:gap-x-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {post.date}
        </span>
        <span
          aria-hidden="true"
          className="hidden size-1 rounded-full bg-muted-foreground/40 sm:inline-block"
        />
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          {toFaDigits(post.readTimeMinutes)} {POST_LABELS.readTimeSuffix}
        </span>
      </span>
    </div>
  );
}

export function PostHeader({ post }: { post: BlogPost }) {
  return (
    <header>
      <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
        <Link
          href="/blog"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-md text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowRight className="size-4" />
          {POST_LABELS.backToBlog}
        </Link>

        <p className="hidden items-center gap-2 text-xs font-bold tracking-wide text-muted-foreground/70 sm:flex">
          <span aria-hidden="true" className="h-px w-8 bg-primary/40" />
          وبلاگ تک‌یار
        </p>
      </div>

      <PostMeta post={post} />

      <h1 className="mt-5 max-w-3xl text-[1.75rem] font-black leading-[1.45] tracking-[-0.01em] sm:text-4xl sm:leading-[1.35] lg:text-[2.75rem] lg:leading-[1.3]">
        {post.title}
      </h1>

      <p className="mt-6 max-w-2xl border-s-[3px] border-primary ps-5 text-[15px] leading-9 text-muted-foreground sm:text-lg sm:leading-10">
        {post.excerpt}
      </p>

      <PostCover category={post.category} />
    </header>
  );
}
