import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_INDEX_LABELS } from "@/components/blog/data";
import type { BlogPost } from "@/lib/blog";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function PostGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div
        className={cn(
          SURFACE_CARD,
          "p-10 text-center text-sm leading-7 text-muted-foreground"
        )}
      >
        {BLOG_INDEX_LABELS.emptyState}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
