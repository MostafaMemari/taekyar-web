import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Newspaper } from "lucide-react";

import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { BlogPost } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";
import { postHref } from "@/lib/routes";
import { SURFACE_CARD } from "@/lib/styles";
import { cn, formatFaDate, toFaDigits } from "@/lib/utils";

function CardCover({ post }: { post: BlogPost }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      {post.coverImage ? (
        <>
          <Image
            src={r2PublicUrl(post.coverImage)}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </>
      ) : (
        <ImagePlaceholder
          icon={Newspaper}
          iconClassName="group-hover/card:scale-[1.08]"
        />
      )}
      {post.category ? (
        <Badge className="absolute start-3 top-3 border-none bg-white/90 text-[11px] font-bold tracking-tight text-[#171717] shadow-sm backdrop-blur-sm sm:text-xs">
          {post.category}
        </Badge>
      ) : null}
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  const href = postHref(post.slug);

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

        {post.date || post.readTimeMinutes ? (
          <p className="mt-1.5 flex flex-nowrap items-center gap-x-2 whitespace-nowrap text-[11px] font-medium text-muted-foreground sm:text-xs">
            {post.date ? <span>{formatFaDate(post.date)}</span> : null}
            {post.date && post.readTimeMinutes ? (
              <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
            ) : null}
            {post.readTimeMinutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3 shrink-0" />
                {toFaDigits(post.readTimeMinutes)} {BLOG_INDEX_LABELS.readTimeSuffix}
              </span>
            ) : null}
          </p>
        ) : null}

        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-2 text-pretty text-[13px] leading-6 text-muted-foreground sm:text-sm sm:leading-7">
            {post.excerpt}
          </p>
        ) : null}

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
