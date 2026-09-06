import Link from "next/link";

import { POST_LABELS } from "@/data/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import { injectHeadingIds } from "@/lib/post-content";
import { tagHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function TagPills({ tags, className }: { tags: BlogPost["tags"]; className?: string }) {
  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <Link
            href={tagHref(tag.slug)}
            className="relative rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PostTags({ tags }: { tags: BlogPost["tags"] }) {
  if (tags.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border/60 pt-5 sm:mt-10 sm:pt-6">
      <span className="text-xs font-bold text-foreground">{POST_LABELS.tagsLabel}</span>
      <TagPills tags={tags} />
    </div>
  );
}

interface ArticleContentProps {
  post: BlogPost;
  content: string;
}

export function ArticleContent({ post, content }: ArticleContentProps) {
  return (
    <div className="max-w-3xl">
      <Card className="p-0">
        <CardContent className="p-4 transition-shadow duration-300 hover:shadow-md hover:shadow-black/[0.06] sm:p-5">
          <article className="article-content" dangerouslySetInnerHTML={{ __html: injectHeadingIds(content) }} />
        </CardContent>
      </Card>
      <PostTags tags={post.tags} />
    </div>
  );
}
