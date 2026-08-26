import { BlogCard } from "@/components/blog/blog-card";
import { POST_LABELS } from "@/components/blog/post-config";
import { BeltDivider } from "@/components/shared/belt-divider";
import type { BlogPost } from "@/lib/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-title">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-black/[0.06] pb-5">
        <div>
          <span className="text-sm font-bold text-primary">{POST_LABELS.relatedEyebrow}</span>
          <h2 id="related-posts-title" className="mt-1.5 text-xl font-black sm:text-2xl">
            {POST_LABELS.relatedTitle}
          </h2>
        </div>
        <BeltDivider fullWidth={false} variant="pill" className="mb-1 hidden h-1 w-16 sm:block" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
