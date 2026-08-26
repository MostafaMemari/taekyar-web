import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { CATEGORY_STYLES } from "@/components/blog/data";
import { POST_LABELS } from "@/components/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import { toFaDigits } from "@/lib/utils";

export function PostTopbar() {
  return (
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
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-80"
        style={{ backgroundColor: `${color}14`, color }}
      >
        <Icon className="size-3.5" />
        {post.category}
      </Link>

      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-belt-black text-[11px] font-black text-white ring-2 ring-white/10"
        >
          ت
        </span>
        <span className="text-xs font-bold text-foreground">{POST_LABELS.author}</span>
      </span>

      <span aria-hidden="true" className="hidden size-1 rounded-full bg-muted-foreground/40 sm:inline-block" />

      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <CalendarDays className="size-3.5" />
        {post.date}
      </span>

      <span aria-hidden="true" className="hidden size-1 rounded-full bg-muted-foreground/40 sm:inline-block" />

      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" />
        {toFaDigits(post.readTimeMinutes)} {POST_LABELS.readTimeSuffix}
      </span>
    </div>
  );
}

export function PostHeader({ post }: { post: BlogPost }) {
  return (
    <header>
      <PostMeta post={post} />

      <h1 className="mt-4 text-[1.625rem] font-black leading-[1.55] sm:text-[2rem] sm:leading-[1.5] lg:mt-5 lg:text-[2.25rem] lg:leading-[1.45] xl:text-[2.5rem] xl:leading-[1.4]">
        {post.title}
      </h1>

      <p className="mt-4 max-w-xl text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9 lg:mt-5">
        {post.excerpt}
      </p>
    </header>
  );
}
