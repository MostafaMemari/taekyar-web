import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogHeader } from "@/components/blog/blog-header";
import { BlogPagination } from "@/components/blog/pagination";
import { CategoryFilter } from "@/components/blog/category-filter";
import { PaginationScrollTop } from "@/components/blog/pagination-scroll-top";
import { BlogIndexSkeleton } from "@/components/blog/loading-skeletons";
import { BLOG_INDEX_LABELS, BLOG_PAGINATION } from "@/data/blog/index-page";
import { PostGrid } from "@/components/blog/post-grid";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { getBlogPostsCount, getPaginatedBlogPosts } from "@/lib/blog";
import { blogCategories, type BlogCategoryName } from "@/data/blog/categories";
import { toFaDigits } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "مقالات و آموزش‌های تکواندو؛ تحلیل فن‌ها، اخبار مسابقات و نکته‌های تغذیه و تناسب از وبلاگ تک‌یار.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

function isBlogCategoryName(value: string): value is BlogCategoryName {
  return (blogCategories as readonly string[]).includes(value);
}

function resolveCategory(value?: string): BlogCategoryName | null {
  if (!value) return null;
  return isBlogCategoryName(value) ? value : null;
}

function buildPageHref(activeCategory: BlogCategoryName | null, page: number): string {
  const params = new URLSearchParams();
  if (activeCategory) params.set("category", activeCategory);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<BlogIndexSkeleton />}>
      <BlogIndex searchParams={searchParams} />
    </Suspense>
  );
}

async function BlogIndex({ searchParams }: BlogPageProps) {
  const { category, page } = await searchParams;
  const activeCategory = resolveCategory(category);

  const totalCount = await getBlogPostsCount(activeCategory);
  const totalPages = Math.max(1, Math.ceil(totalCount / BLOG_PAGINATION.postsPerPage));
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const { posts: visiblePosts } = await getPaginatedBlogPosts({
    category: activeCategory,
    page: currentPage,
    perPage: BLOG_PAGINATION.postsPerPage,
  });
  const hrefFor = (targetPage: number) => buildPageHref(activeCategory, targetPage);

  return (
    <>
      <Section spacing="none" containerClassName="pb-4 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
        <PaginationScrollTop targetId="archive-top" />
        <Reveal>
          <BlogHeader />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 flex flex-col gap-3 border-b border-border/60 pb-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5">
            <CategoryFilter activeCategory={activeCategory} />
            <p className="shrink-0 text-xs font-medium text-muted-foreground sm:text-[13px]">
              <span className="font-bold tabular-nums text-foreground">{toFaDigits(totalCount)}</span> {BLOG_INDEX_LABELS.resultsSuffix}
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

      <Section spacing="none" containerClassName="pt-8 sm:pt-10">
        <PostGrid posts={visiblePosts} />
      </Section>

      {totalPages > 1 ? (
        <Section spacing="compact">
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
