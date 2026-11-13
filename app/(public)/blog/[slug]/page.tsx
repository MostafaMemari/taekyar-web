import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "@/components/blog/article-content";
import { CommentsSection } from "@/components/blog/comments/comments-section";
import { PostCover } from "@/components/blog/post-cover";
import { PostFooter } from "@/components/blog/post-footer";
import { PostHeader } from "@/components/blog/post-header";
import { POST_CONTACT_CTA, POST_FAQ_COPY, POST_LAYOUT, RELATED_POSTS_COUNT } from "@/data/blog/post-config";
import { FaqSection } from "@/components/faq/faq-section";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TocCollapse } from "@/components/blog/toc-collapse";
import { ContactBanner } from "@/components/shared/contact-banner";
import { JsonLd } from "@/components/shared/json-ld";
import { Section } from "@/components/shared/section";
import { getPostComments, getBlogPosts, getPostBySlug, getCategoryAncestorsByPath } from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getHeadings } from "@/lib/blog/post-content";
import { getRelatedPosts } from "@/lib/blog/related";
import { buildPageMetadata } from "@/lib/seo/seo";
import { resolveSeo } from "@/lib/seo/seo-resolve";
import { categoryHref, postHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decodeParam(slug));

  if (!post) return { title: "مقاله یافت نشد" };

  const seo = resolveSeo(post.seo, {
    title: post.title,
    description: post.excerpt,
    canonicalPath: postHref(post.slug),
  });

  return buildPageMetadata({
    ...seo,
    path: postHref(post.slug),
    imageUrl: post.coverImage ?? post.categoryImage,
    imageAlt: post.coverImageAlt ?? post.title,
    publishedTime: post.date ?? post.createdAt,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeParam(slug));

  if (!post) notFound();

  const content = post.content;
  const headings = getHeadings(content);
  const [allPosts, comments, categoryAncestors] = await Promise.all([
    getBlogPosts(),
    getPostComments(post.slug),
    getCategoryAncestorsByPath(post.categoryPath ?? ""),
  ]);
  const relatedPosts = getRelatedPosts(allPosts, post.slug, post.category, RELATED_POSTS_COUNT);
  const categoryTrail =
    post.category && post.categoryPath
      ? [
          ...categoryAncestors.map((ancestor) => ({
            name: ancestor.name,
            path: categoryHref(ancestor.path),
          })),
          { name: post.category, path: categoryHref(post.categoryPath) },
        ]
      : [];

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "وبلاگ", path: "/blog" }, ...categoryTrail, { name: post.title, path: postHref(post.slug) }])}
      />
      <Section spacing="none" containerClassName="pt-6 sm:pt-10">
        <PostHeader post={post} trail={categoryTrail} />

        <div className="mt-10 sm:mt-12">
          <PostCover post={post} />
        </div>

        <div
          className={cn(
            "mt-10 grid gap-8 sm:mt-12 lg:gap-x-10 xl:gap-x-14",
            POST_LAYOUT.postColumns,
          )}
        >
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <TocCollapse items={headings} />
            <article className="mt-5 sm:mt-6 lg:mt-0">
              <ArticleContent post={post} content={content} />
            </article>

            {post.faqs.length > 0 ? (
              <div className="mt-10 sm:mt-12">
                <FaqSection faqs={post.faqs} {...POST_FAQ_COPY} />
              </div>
            ) : null}

            <CommentsSection comments={comments} postSlug={post.slug} />

            <PostFooter slug={post.slug} title={post.title} />
          </div>

          <aside
            aria-label="ابزارهای مقاله"
            className="min-w-0 lg:col-start-2 lg:row-start-1"
          >
            <div className="hidden lg:sticky lg:top-[96px] lg:block">
              <TableOfContents items={headings} />
            </div>
          </aside>
        </div>
      </Section>

      <Section spacing="compact">
        <div>
          <RelatedPosts posts={relatedPosts} />
        </div>

        <div className="mt-8 sm:mt-10">
          <ContactBanner
            title={POST_CONTACT_CTA.title}
            description={POST_CONTACT_CTA.description}
            actionLabel={POST_CONTACT_CTA.actionLabel}
            actionHref={POST_CONTACT_CTA.actionHref}
          />
        </div>
      </Section>
    </>
  );
}
