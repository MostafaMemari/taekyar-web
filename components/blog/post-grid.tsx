import Link from "next/link";
import { SearchX } from "lucide-react";

import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import type { BlogPost } from "@/lib/blog";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function PostGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className={cn(SURFACE_CARD, "flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-14")}>
        <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <SearchX className="size-6" />
        </span>
        <h3 className="mt-4 text-base font-bold text-foreground">مقاله‌ای یافت نشد</h3>
        <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">{BLOG_INDEX_LABELS.emptyState}</p>
        <Link
          href="/blog"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {BLOG_INDEX_LABELS.allCategories} — نمایش همه
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
