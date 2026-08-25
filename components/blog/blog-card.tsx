import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { BLOG_INDEX_LABELS, CATEGORY_STYLES } from "@/components/blog/data";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";
import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";

function CardCover({ post }: { post: BlogPost }) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <div className="relative h-36 w-full overflow-hidden sm:h-40">
      <div className="absolute inset-0" style={{ backgroundColor: color }} />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
      <Icon
        className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-white/30 transition-transform duration-300 group-hover/card:scale-[1.08]"
        strokeWidth={1.5}
      />
      <Badge className="absolute start-3 top-3 border-none bg-white/95 text-xs font-semibold text-[#171717] shadow-sm">
        {post.category}
      </Badge>
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;

  return (
    <article
      className={cn(
        SURFACE_CARD,
        SURFACE_CARD_INTERACTIVE,
        "group/card flex h-full flex-col overflow-hidden"
      )}
    >
      <CardCover post={post} />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-7">
          <Link
            href={href}
            className="line-clamp-1 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs font-medium text-muted-foreground">
          <span>{post.date}</span>
          <span aria-hidden="true" className="text-muted-foreground/40">
            ·
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.readTimeMinutes} {BLOG_INDEX_LABELS.readTimeSuffix}
          </span>
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
          {post.excerpt}
        </p>

        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-primary transition-all group-hover/card:gap-2.5"
        >
          {BLOG_INDEX_LABELS.readMore}
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </article>
  );
}
