import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { CATEGORY_STYLES } from "@/components/blog/data";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

const EDITORIAL_TEAM = "تیم تحریریه تک‌یار";

interface PostHeaderProps {
  post: BlogPost;
}

export function PostHeader({ post }: PostHeaderProps) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowRight className="size-4" />
        بازگشت به وبلاگ
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge
          className="border-none text-xs font-semibold"
          style={{ backgroundColor: `${color}14`, color }}
        >
          {post.category}
        </Badge>
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="size-3.5" />
          {post.date} · {post.readTimeMinutes} دقیقه مطالعه
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          · نوشته از {EDITORIAL_TEAM}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-black leading-[1.4] sm:text-4xl sm:leading-[1.3]">
        {post.title}
      </h1>

      <p className="mt-5 border-s-2 border-primary/40 ps-4 text-base leading-9 text-muted-foreground">
        {post.excerpt}
      </p>

      <div
        className="relative mt-8 h-56 w-full overflow-hidden rounded-2xl sm:h-72 lg:h-80"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
        <Icon
          className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-white/25"
          strokeWidth={1.25}
        />
      </div>
    </>
  );
}
