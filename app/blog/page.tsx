import type { Metadata } from "next";

import { BlogHeader } from "@/components/blog/blog-header";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BLOG_INDEX_LABELS } from "@/components/blog/data";
import { PostGrid } from "@/components/blog/post-grid";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { blogCategories, blogPosts, type BlogCategoryName } from "@/lib/blog";
import { toFaDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "مقالات و آموزش‌های تکواندو؛ تحلیل فن‌ها، اخبار مسابقات و نکته‌های تغذیه و تناسب از وبلاگ تک‌یار.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

function resolveCategory(value?: string): BlogCategoryName | null {
  if (!value) return null;
  return (blogCategories as string[]).includes(value) ? (value as BlogCategoryName) : null;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const activeCategory = resolveCategory(category);

  const posts = activeCategory ? blogPosts.filter((post) => post.category === activeCategory) : blogPosts;

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <Reveal>
          <BlogHeader />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-black/[0.06] pb-5">
            <CategoryFilter activeCategory={activeCategory} />
            <p className="text-xs font-medium text-muted-foreground">
              <span className="font-bold text-foreground">{toFaDigits(posts.length)}</span> {BLOG_INDEX_LABELS.resultsSuffix}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-0 sm:pt-0 lg:pt-0">
        <PostGrid posts={posts} />
      </Section>
    </>
  );
}
