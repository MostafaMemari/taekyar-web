import type { Metadata } from "next";

import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPagination } from "@/components/blog/pagination";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BLOG_INDEX_LABELS, BLOG_PAGINATION } from "@/data/blog/index-page";
import { PostGrid } from "@/components/blog/post-grid";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { blogCategories, blogPosts, type BlogCategoryName } from "@/data/blog/posts";
import { toFaDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "مقالات و آموزش‌های تکواندو؛ تحلیل فن‌ها، اخبار مسابقات و نکته‌های تغذیه و تناسب از وبلاگ تک‌یار.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

function resolveCategory(value?: string): BlogCategoryName | null {
  if (!value) return null;
  return (blogCategories as string[]).includes(value) ? (value as BlogCategoryName) : null;
}

function buildPageHref(activeCategory: BlogCategoryName | null, page: number): string {
  const params = new URLSearchParams();
  if (activeCategory) params.set("category", activeCategory);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, page } = await searchParams;
  const activeCategory = resolveCategory(category);

  const posts = activeCategory ? blogPosts.filter((post) => post.category === activeCategory) : blogPosts;

  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGINATION.postsPerPage));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const visiblePosts = posts.slice(
    (currentPage - 1) * BLOG_PAGINATION.postsPerPage,
    currentPage * BLOG_PAGINATION.postsPerPage,
  );
  const hrefFor = (targetPage: number) => buildPageHref(activeCategory, targetPage);

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
              {totalPages > 1 && (
                <>
                  {" · "}
                  صفحه {toFaDigits(currentPage)} از {toFaDigits(totalPages)}
                </>
              )}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-6 pb-2 sm:pt-7 lg:pt-8">
        <PostGrid posts={visiblePosts} />
      </Section>

      {totalPages > 1 ? (
        <Section containerClassName="pb-12 pt-8 sm:pb-16">
          <Reveal delay={160}>
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hrefFor={hrefFor}
            />
          </Reveal>
        </Section>
      ) : (
        <div className="pb-10" aria-hidden="true" />
      )}
    </>
  );
}
