import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "@/components/blog/article-content";
import { CommentsSection } from "@/components/blog/comments/comments-section";
import { PostCover } from "@/components/blog/post-cover";
import { PostHeader, PostTopbar } from "@/components/blog/post-header";
import { POST_CONTACT_CTA, POST_LAYOUT, RELATED_POSTS_COUNT } from "@/data/blog/post-config";
import { RelatedPosts } from "@/components/blog/related-posts";
import { SidebarAppCta } from "@/components/blog/sidebar-app-cta";
import { SidebarCategories } from "@/components/blog/sidebar-categories";
import { SidebarGuides } from "@/components/blog/sidebar-guides";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TocCollapse } from "@/components/blog/toc-collapse";
import { ContactBanner } from "@/components/shared/contact-banner";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { getPostComments, getBlogPosts, getPostBySlug, type BlogCategoryName } from "@/lib/blog";
import { getHeadings, type TocItem } from "@/lib/post-content";
import { getRelatedPosts } from "@/lib/blog-related";
import { cn } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
    <div className="space-y-3.5 sm:space-y-4 lg:sticky lg:top-[88px]">
      <div className="hidden lg:block">
        <TableOfContents items={tocItems} />
      </div>
      <SidebarGuides currentSlug={slug} />
      <SidebarCategories activeCategory={category} />
      <SidebarAppCta />
    </div>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const blocks = post.content;
  const headings = getHeadings(blocks);
  const allPosts = await getBlogPosts();
  const relatedPosts = getRelatedPosts(allPosts, post.slug, post.category, RELATED_POSTS_COUNT);
  const comments = await getPostComments(post.slug);

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <Reveal>
          <PostTopbar />

          <div
            className={cn(
              "mt-6 grid gap-6 sm:mt-7 sm:gap-7 lg:mt-10 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 xl:gap-x-14",
              POST_LAYOUT.postColumns,
            )}
          >
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <PostHeader post={post} />
            </div>

            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              <PostCover category={post.category} />
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <TocCollapse items={headings} />
              <Reveal delay={80}>
                <article className="mt-5 sm:mt-6 lg:mt-0">
                  <ArticleContent post={post} blocks={blocks} />
                </article>
              </Reveal>

              <Reveal delay={120}>
                <CommentsSection comments={comments} postSlug={post.slug} />
              </Reveal>
            </div>

            <aside aria-label="ابزارهای مقاله" className="min-w-0 lg:col-start-2 lg:row-start-2">
              <PostRail slug={post.slug} category={post.category} tocItems={headings} />
            </aside>
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-8 sm:pt-10">
        <div>
          <Reveal delay={100}>
            <RelatedPosts posts={relatedPosts} />
          </Reveal>
        </div>

        <div className="mt-8 sm:mt-10">
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
