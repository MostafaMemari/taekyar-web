import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { CATEGORY_STYLES } from "@/data/blog/index-page";
import { POST_LABELS } from "@/data/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import { toFaDigits } from "@/lib/utils";

export function PostTopbar() {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] pb-4 sm:pb-5">
      <Link
        href="/blog"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-0 sm:text-sm"
      >
        <ArrowRight className="size-3.5 sm:size-4" />
        {POST_LABELS.backToBlog}
      </Link>

      <p className="hidden items-center gap-2 text-xs font-bold tracking-wide text-muted-foreground/70 sm:flex">
        <span aria-hidden="true" className="h-px w-8 bg-primary/40" />
        وبلاگ تک‌یار
      </p>
    </div>
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:gap-x-3 sm:gap-y-2.5">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition-opacity hover:opacity-80 sm:px-3 sm:py-1.5 sm:text-xs"
        style={{ backgroundColor: `${color}14`, color }}
      >
        <Icon className="size-3.5" />
        {post.category}
      </Link>

      <span className="inline-flex items-center gap-1.5 sm:gap-2">
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-belt-black text-[10px] font-black text-white ring-2 ring-white/10 sm:size-7 sm:text-[11px]"
        >
          ت
        </span>
        <span className="text-[11px] font-bold text-foreground sm:text-xs">{POST_LABELS.author}</span>
      </span>

      <span aria-hidden="true" className="hidden size-1 rounded-full bg-muted-foreground/40 sm:inline-block" />

      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground sm:gap-1.5 sm:text-xs">
        <CalendarDays className="size-3 sm:size-3.5" />
        {post.date}
      </span>

      <span aria-hidden="true" className="hidden size-1 rounded-full bg-muted-foreground/40 sm:inline-block" />

      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground sm:gap-1.5 sm:text-xs">
        <Clock className="size-3 sm:size-3.5" />
        {toFaDigits(post.readTimeMinutes)} {POST_LABELS.readTimeSuffix}
      </span>
    </div>
  );
}

export function PostHeader({ post }: { post: BlogPost }) {
  return (
    <header>
      <PostMeta post={post} />

      <h1 className="mt-3.5 text-balance text-[1.45rem] font-black leading-[1.6] tracking-tight sm:mt-4 sm:text-[1.9rem] sm:leading-[1.5] lg:mt-5 lg:text-[2.25rem] lg:leading-[1.45] xl:text-[2.5rem] xl:leading-[1.4]">
        {post.title}
      </h1>

      <p className="mt-3 max-w-xl text-pretty text-[14.5px] leading-7 text-muted-foreground sm:mt-4 sm:text-[15.5px] sm:leading-8 lg:mt-5 lg:text-base lg:leading-9">
        {post.excerpt}
      </p>
    </header>
  );
}
