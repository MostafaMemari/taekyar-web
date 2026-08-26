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
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
        <Reveal>
          <BlogHeader />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 flex flex-col gap-3 border-b border-black/[0.06] pb-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5">
            <CategoryFilter activeCategory={activeCategory} />
            <p className="shrink-0 text-xs font-medium text-muted-foreground sm:text-[13px]">
              <span className="font-bold tabular-nums text-foreground">{toFaDigits(posts.length)}</span> {BLOG_INDEX_LABELS.resultsSuffix}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-6 sm:pt-7 lg:pt-8">
        <PostGrid posts={posts} />
      </Section>
    </>
  );
}
