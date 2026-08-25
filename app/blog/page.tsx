import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_INDEX_INTRO } from "@/components/blog/data";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { BeltDivider } from "@/components/shared/belt-divider";
import { blogCategories, blogPosts, type BlogCategoryName } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "وبلاگ",
  description:
    "مقالات و آموزش‌های تکواندو؛ تحلیل فن‌ها، اخبار مسابقات و نکته‌های تغذیه و تناسب از وبلاگ تک‌یار.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

function isValidCategory(value: string): value is BlogCategoryName {
  return (blogCategories as string[]).includes(value);
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const activeCategory =
    category && isValidCategory(category) ? category : null;

  const filteredPosts = activeCategory
    ? blogPosts.filter((post) => post.category === activeCategory)
    : blogPosts;

  const filterHref = (value?: BlogCategoryName) =>
    value ? `/blog?category=${encodeURIComponent(value)}` : "/blog";

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-bold text-primary">
              {BLOG_INDEX_INTRO.eyebrow}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">
              {BLOG_INDEX_INTRO.title}
            </h1>
            <BeltDivider
              fullWidth={false}
              variant="pill"
              className="mt-4 h-1 w-20"
            />
            <p className="mt-4 text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
              {BLOG_INDEX_INTRO.description}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <nav
            aria-label="فیلتر دسته‌بندی مقالات"
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            <FilterChip href="/blog" active={!activeCategory}>
              همه
            </FilterChip>
            {blogCategories.map((name) => (
              <FilterChip
                key={name}
                href={filterHref(name)}
                active={activeCategory === name}
              >
                {name}
              </FilterChip>
            ))}
          </nav>
        </Reveal>
      </Section>

      <Section containerClassName="pt-0 sm:pt-0 lg:pt-0">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-card p-8 text-center text-sm leading-7 text-muted-foreground ring-1 ring-black/[0.05]">
            هنوز مقاله‌ای در این دسته‌بندی منتشر نشده؛ به‌زودی مطالب جدید اضافه می‌شود.
          </p>
        )}
      </Section>
    </>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}
