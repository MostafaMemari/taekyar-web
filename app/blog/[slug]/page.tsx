import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "@/components/blog/article-content";
import { PostHeader } from "@/components/blog/post-header";
import {
  POST_CONTACT_CTA,
  POST_LAYOUT,
  RELATED_POSTS_COUNT,
} from "@/components/blog/post-config";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ContactBanner } from "@/components/shared/contact-banner";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { blogPosts } from "@/lib/blog";
import { getHeadings, getPostBlocks } from "@/lib/blog-content";
import { getRelatedPosts } from "@/lib/blog-related";
import { cn } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return { title: "مقاله یافت نشد" };

  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const blocks = getPostBlocks(post.slug) ?? [];
  const headings = getHeadings(blocks);
  const relatedPosts = getRelatedPosts(
    blogPosts,
    post.slug,
    post.category,
    RELATED_POSTS_COUNT
  );

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <div className={cn("mx-auto", POST_LAYOUT.headerWidth)}>
          <Reveal>
            <PostHeader post={post} />
          </Reveal>
        </div>
      </Section>

      <Section containerClassName="pt-0 sm:pt-0 lg:pt-0">
        <div
          className={cn(
            "mx-auto grid gap-8",
            POST_LAYOUT.bodyWidth,
            POST_LAYOUT.tocColumns
          )}
        >
          <aside className="hidden self-stretch lg:block">
            <TableOfContents items={headings} />
          </aside>

          <div className="min-w-0 space-y-10 sm:space-y-12">
            <Reveal delay={80}>
              <article>
                <ArticleContent post={post} blocks={blocks} />
              </article>
            </Reveal>

            <Reveal delay={100}>
              <RelatedPosts posts={relatedPosts} />
            </Reveal>
          </div>
        </div>

        <div className={cn("mx-auto mt-10 sm:mt-12", POST_LAYOUT.bodyWidth)}>
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
