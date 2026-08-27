import { BlogCard } from "@/components/blog/blog-card";
import { POST_LABELS } from "@/data/blog/post-config";
import { BeltDivider } from "@/components/shared/belt-divider";
import type { BlogPost } from "@/data/blog/posts";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-title">
      <div className="border-b border-black/[0.06] pb-4 sm:pb-5">
        <p className="text-[11px] font-bold tracking-wide text-primary sm:text-xs">{POST_LABELS.relatedEyebrow}</p>
        <h2 id="related-posts-title" className="mt-1.5 text-[1.25rem] font-black leading-tight sm:text-2xl">
          {POST_LABELS.relatedTitle}
        </h2>
        <BeltDivider variant="pill" className="mt-3 h-1 w-12 sm:w-16" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
