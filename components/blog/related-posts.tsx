import Link from "next/link";

import { TagPills } from "@/components/blog/article-content";
import { CardCover } from "@/components/blog/blog-card";
import { POST_LABELS } from "@/data/blog/post-config";
import { BeltDivider } from "@/components/shared/belt-divider";
import type { BlogPost } from "@/lib/blog";
import { postHref } from "@/lib/routes";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: BlogPost[];
}

function RelatedPostCard({ post }: { post: BlogPost }) {
  const href = postHref(post.slug);

  return (
    <article
      className={cn(
        SURFACE_CARD,
        "group/card relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.06]"
      )}
    >
      <CardCover post={post} />

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[15px] font-bold leading-6 sm:text-[16px] sm:leading-7">
          <Link
            href={href}
            className="block truncate rounded-sm transition-colors before:absolute before:inset-0 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-2 text-pretty text-[13px] leading-6 text-muted-foreground sm:text-sm sm:leading-7">
            {post.excerpt}
          </p>
        ) : null}

        {post.tags.length > 0 ? (
          <TagPills tags={post.tags} className="mt-auto pt-3 sm:pt-4" />
        ) : null}
      </div>
    </article>
  );
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-title">
      <div className="border-b border-border/60 pb-4 sm:pb-5">
        <p className="text-[11px] font-bold tracking-wide text-primary sm:text-xs">{POST_LABELS.relatedEyebrow}</p>
        <h2 id="related-posts-title" className="mt-1.5 text-[1.25rem] font-black leading-tight sm:text-2xl">
          {POST_LABELS.relatedTitle}
        </h2>
        <BeltDivider variant="pill" className="mt-3 h-1 w-12 sm:w-16" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {posts.map((post) => (
          <RelatedPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
