import { PostBody } from "@/components/blog/post-body";
import { POST_LABELS } from "@/components/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import type { PostBlock } from "@/lib/blog-content";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-5 sm:mt-10 sm:pt-6">
      <span className="text-xs font-bold text-foreground">{POST_LABELS.tagsLabel}</span>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
        >
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
    <div className={cn(SURFACE_CARD, "p-4 sm:p-6 lg:p-10 xl:p-12")}>
      <div className="max-w-3xl">
        <PostBody blocks={blocks} />
      </div>
      <PostTags tags={post.tags} />
    </div>
  );
}
