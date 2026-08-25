import { Check } from "lucide-react";

import { PostBody } from "@/components/blog/post-body";
import { POST_LABELS } from "@/components/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import type { PostBlock } from "@/lib/blog-content";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-6">
      <span className="text-xs font-bold text-foreground">{POST_LABELS.tagsLabel}</span>
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground"
        >
          <Check className="size-3 text-belt-green" strokeWidth={3} />
          {tag}
        </span>
      ))}
    </div>
  );
}

interface ArticleContentProps {
  post: BlogPost;
  blocks: PostBlock[];
}

export function ArticleContent({ post, blocks }: ArticleContentProps) {
  return (
    <div className={cn(SURFACE_CARD, "p-5 sm:p-7 lg:p-10")}>
      <div className="max-w-2xl">
        <PostBody blocks={blocks} />
      </div>
      <PostTags tags={post.tags} />
    </div>
  );
}
