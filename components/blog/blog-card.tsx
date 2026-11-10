import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Newspaper } from "lucide-react";

import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { BlogPost } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/media/r2-url";
import { postHref } from "@/lib/routes";
import { cn, formatFaDate, toFaDigits } from "@/lib/utils";

export function CardCover({ post }: { post: BlogPost }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      {post.coverImage ? (
        <>
          <Image
            src={r2PublicUrl(post.coverImage)}
            alt={post.coverImageAlt || post.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </>
      ) : (
        <ImagePlaceholder icon={Newspaper} iconClassName="group-hover/card:scale-[1.08]" />
      )}
      {post.category ? (
        <Badge className="absolute start-3 top-3 border-none bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] text-[11px] font-extrabold tracking-tight text-[#2A1F00] shadow-[0_6px_16px_-6px_rgba(154,109,0,0.6)] sm:text-xs">
          {post.category}
        </Badge>
      ) : null}
    </div>
  );
}

export function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  const href = postHref(post.slug);

  return (
    <Card
      asChild
      interactive
      className={cn(
        "relative h-full p-0 gap-0",
        featured && "lg:flex lg:flex-row lg:items-stretch",
      )}
    >
      <article>
        <div className={cn(featured && "lg:w-[52%] lg:shrink-0")}>
          <CardCover post={post} />
        </div>

        <CardContent
          className={cn(
            "flex min-w-0 flex-1 flex-col p-4 sm:p-5",
            featured && "lg:justify-center lg:gap-1 lg:p-8",
          )}
        >
          <h3
            className={cn(
              "text-[15px] font-bold leading-6 sm:text-[16px] sm:leading-7",
              featured && "text-[17px] leading-7 sm:text-[19px] sm:leading-8 lg:text-[21px] lg:leading-9",
            )}
          >
            <Link
              href={href}
              className="block rounded-sm line-clamp-2 transition-colors before:absolute before:inset-0 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? (
            <p
              className={cn(
                "mt-2.5 line-clamp-2 text-pretty text-[13px] leading-6 text-muted-foreground sm:text-sm sm:leading-7",
                featured && "lg:line-clamp-3",
              )}
            >
              {post.excerpt}
            </p>
          ) : null}

          <div className="min-h-3 flex-1" />

          {post.date || post.readTimeMinutes ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-dashed border-black/[0.08] pt-3 text-[11px] font-medium text-black/45 sm:text-xs">
              {post.readTimeMinutes ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-[#E0A800]" />
                  {toFaDigits(post.readTimeMinutes)} {BLOG_INDEX_LABELS.readTimeSuffix}
                </span>
              ) : null}
              {post.date ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-[#E0A800]" />
                  {formatFaDate(post.date)}
                </span>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </article>
    </Card>
  );
}
