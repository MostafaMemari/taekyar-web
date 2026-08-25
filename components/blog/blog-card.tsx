import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";
import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "./data";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { color, Icon } = CATEGORY_STYLES[post.category];
  const href = `/blog/${post.slug}`;

  return (
    <article
      className={cn(
        SURFACE_CARD,
        SURFACE_CARD_INTERACTIVE,
        "flex h-full flex-col overflow-hidden"
      )}
    >
      <div className="relative h-32 w-full overflow-hidden sm:h-36">
        <div className="absolute inset-0" style={{ backgroundColor: color }} />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
        <Icon
          className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-white/30"
          strokeWidth={1.5}
        />
        <Badge className="absolute start-3 top-3 border-none bg-white/90 text-xs font-semibold text-[#171717] shadow-sm">
          {post.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-7 [&_a]:line-clamp-1">
          <Link href={href} className="transition-colors hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {post.date} · {post.readTimeMinutes} دقیقه مطالعه
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground line-clamp-3">{post.excerpt}</p>

        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          ادامه مطلب
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </article>
  );
}
