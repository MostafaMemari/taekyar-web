import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { BLOG_INDEX_LABELS, CATEGORY_STYLES } from "@/data/blog/index-page";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

function CardCover({ post }: { post: BlogPost }) {
  const { color, Icon } = CATEGORY_STYLES[post.category];

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: color }} />
      <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.14),transparent_62%)]" />
      <Icon
        className="absolute left-1/2 top-1/2 size-[52px] -translate-x-1/2 -translate-y-1/2 text-white/30 transition-transform duration-500 group-hover/card:scale-[1.06] sm:size-14"
        strokeWidth={1.4}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-xl ring-1 ring-white/15" />
      <Badge className="absolute start-3 top-3 border-none bg-white/90 text-[11px] font-bold tracking-tight text-[#171717] shadow-sm backdrop-blur-sm sm:text-xs">
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
        "group/card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06]"
      )}
    >
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={post.title}>
        <CardCover post={post} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[15px] font-bold leading-6 sm:text-[16px] sm:leading-7">
          <Link
            href={href}
            className="block truncate rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex flex-nowrap items-center gap-x-2 whitespace-nowrap text-[11px] font-medium text-muted-foreground sm:text-xs">
          <span>{post.date}</span>
          <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3 shrink-0" />
            {post.readTimeMinutes} {BLOG_INDEX_LABELS.readTimeSuffix}
          </span>
        </p>

        <p className="mt-2.5 line-clamp-2 text-pretty text-[13px] leading-6 text-muted-foreground sm:text-sm sm:leading-7">
          {post.excerpt}
        </p>

        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-[13px] font-bold text-primary transition-all group-hover/card:gap-2 sm:pt-5 sm:text-sm"
        >
          {BLOG_INDEX_LABELS.readMore}
          <ArrowLeft className="size-3.5 sm:size-4" />
        </Link>
      </div>
    </article>
  );
}
