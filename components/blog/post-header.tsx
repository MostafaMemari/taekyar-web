import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { CATEGORY_STYLES } from "@/components/blog/data";
import { POST_LABELS } from "@/components/blog/post-config";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

function PostCover({ category }: { category: BlogPost["category"] }) {
  const { color, Icon } = CATEGORY_STYLES[category];

  return (
    <div
      className="relative mt-8 h-48 w-full overflow-hidden rounded-2xl ring-1 ring-black/[0.06] sm:h-64 lg:h-72"
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
      <Icon
        className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-white/25"
        strokeWidth={1.25}
      />
    </div>
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  const { color } = CATEGORY_STYLES[post.category];

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
      <Badge
        className="border-none text-xs font-semibold"
        style={{ backgroundColor: `${color}14`, color }}
      >
        {post.category}
      </Badge>
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" />
        {post.readTimeMinutes} {POST_LABELS.readTimeSuffix}
      </span>
      <span className="text-xs font-medium text-muted-foreground">{post.date}</span>
      <span className="text-xs font-medium text-muted-foreground">
        {POST_LABELS.author}
      </span>
    </div>
  );
}

export function PostHeader({ post }: { post: BlogPost }) {
  return (
    <header>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowRight className="size-4" />
        {POST_LABELS.backToBlog}
      </Link>

      <PostMeta post={post} />

      <h1 className="mt-4 max-w-2xl text-[1.75rem] font-black leading-[1.4] sm:text-4xl sm:leading-[1.3]">
        {post.title}
      </h1>

      <p className="mt-5 border-s-2 border-primary/40 ps-4 text-[15px] leading-9 text-muted-foreground sm:text-base">
        {post.excerpt}
      </p>

      <PostCover category={post.category} />
    </header>
  );
}
