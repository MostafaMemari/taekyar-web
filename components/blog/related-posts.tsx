import { BlogCard } from "@/components/blog/blog-card";
import { POST_LABELS } from "@/components/blog/post-config";
import type { BlogPost } from "@/lib/blog";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-title">
      <h2 id="related-posts-title" className="text-lg font-extrabold sm:text-xl">
        {POST_LABELS.relatedTitle}
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
