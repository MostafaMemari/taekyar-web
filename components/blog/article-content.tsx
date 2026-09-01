import Link from "next/link";

import { POST_LABELS } from "@/data/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import { injectHeadingIds } from "@/lib/post-content";
import { tagHref } from "@/lib/routes";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function PostTags({ tags }: { tags: BlogPost["tags"] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-5 sm:mt-10 sm:pt-6">
      <span className="text-xs font-bold text-foreground">{POST_LABELS.tagsLabel}</span>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={tagHref(tag.slug)}
          className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}

interface ArticleContentProps {
  post: BlogPost;
  content: string;
}

export function ArticleContent({ post, content }: ArticleContentProps) {
  return (
    <div className={cn(SURFACE_CARD, "p-4 sm:p-6 lg:p-10 xl:p-12")}>
      <div className="max-w-3xl">
        <article
          className="article-content"
          dangerouslySetInnerHTML={{ __html: injectHeadingIds(content) }}
        />
      </div>
      <PostTags tags={post.tags} />
    </div>
  );
}
