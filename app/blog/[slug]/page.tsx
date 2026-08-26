import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "@/components/blog/article-content";
import { PostCover } from "@/components/blog/post-cover";
import { PostHeader, PostTopbar } from "@/components/blog/post-header";
import { POST_CONTACT_CTA, POST_LAYOUT, RELATED_POSTS_COUNT } from "@/components/blog/post-config";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { SidebarAppCta } from "@/components/blog/sidebar-app-cta";
import { SidebarCategories } from "@/components/blog/sidebar-categories";
import { SidebarGuides } from "@/components/blog/sidebar-guides";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TocCollapse } from "@/components/blog/toc-collapse";
import { ContactBanner } from "@/components/shared/contact-banner";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { blogPosts, type BlogCategoryName } from "@/lib/blog";
import { getHeadings, getPostBlocks, type TocItem } from "@/lib/blog-content";
import { getRelatedPosts } from "@/lib/blog-related";
import { cn } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return { title: "مقاله یافت نشد" };

  return { title: post.title, description: post.excerpt };
}

interface PostRailProps {
  slug: string;
  category: BlogCategoryName;
  tocItems: TocItem[];
}

function PostRail({ slug, category, tocItems }: PostRailProps) {
  return (
    <div className="space-y-5 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pe-1">
      <TableOfContents items={tocItems} />
      <SidebarGuides currentSlug={slug} />
      <SidebarCategories activeCategory={category} />
      <SidebarAppCta />
    </div>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const blocks = getPostBlocks(post.slug) ?? [];
  const headings = getHeadings(blocks);
  const relatedPosts = getRelatedPosts(blogPosts, post.slug, post.category, RELATED_POSTS_COUNT);

  return (
    <>
      <ReadingProgress />

      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <Reveal>
          <PostTopbar />

          <div
            className={cn(
              "mt-6 grid gap-8 sm:mt-8 lg:mt-10 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 xl:gap-x-14",
              POST_LAYOUT.postColumns,
            )}
          >
            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              <PostCover category={post.category} />
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <PostHeader post={post} />
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <TocCollapse items={headings} />
              <Reveal delay={80}>
                <article className="mt-6 lg:mt-0">
                  <ArticleContent post={post} blocks={blocks} />
                </article>
              </Reveal>
            </div>

            <aside aria-label="ابزارهای مقاله" className="min-w-0 lg:col-start-2 lg:row-start-2">
              <PostRail slug={post.slug} category={post.category} tocItems={headings} />
            </aside>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="mt-10 sm:mt-12">
          <Reveal delay={100}>
            <RelatedPosts posts={relatedPosts} />
          </Reveal>
        </div>

        <div className="mt-10 sm:mt-12">
          <Reveal delay={120}>
            <ContactBanner
              title={POST_CONTACT_CTA.title}
              description={POST_CONTACT_CTA.description}
              actionLabel={POST_CONTACT_CTA.actionLabel}
              actionHref={POST_CONTACT_CTA.actionHref}
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
