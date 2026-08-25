import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleContent } from "@/components/blog/article-content";
import { PostHeader } from "@/components/blog/post-header";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ContactBanner } from "@/components/shared/contact-banner";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { getHeadings, getPostBlocks } from "@/lib/blog-content";
import { blogPosts } from "@/lib/blog";

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
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return { title: "مقاله یافت نشد" };

  return { title: post.title, description: post.excerpt };
}

const RELATED_COUNT = 3;
const TOC_COLUMNS = "lg:grid-cols-[15rem_minmax(0,1fr)]";

function getRelatedPosts(slug: string, category: string) {
  const sameCategory = blogPosts.filter(
    (post) => post.slug !== slug && post.category === category
  );
  const others = blogPosts.filter(
    (post) => post.slug !== slug && post.category !== category
  );

  return [...sameCategory, ...others].slice(0, RELATED_COUNT);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const blocks = getPostBlocks(post.slug);
  const headings = blocks ? getHeadings(blocks) : [];
  const relatedPosts = getRelatedPosts(post.slug, post.category);

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <PostHeader post={post} />
          </Reveal>
        </article>
      </Section>

      <Section containerClassName="pt-0 sm:pt-0 lg:pt-0">
        <div className={TOC_COLUMNS ? `mx-auto grid max-w-5xl gap-8 ${TOC_COLUMNS}` : ""}>
          <aside className="hidden self-stretch lg:block">
            <TableOfContents items={headings} />
          </aside>

          <div className="min-w-0 space-y-12">
            {blocks ? (
              <Reveal delay={80}>
                <ArticleContent post={post} blocks={blocks} />
              </Reveal>
            ) : null}

            <Reveal delay={100}>
              <RelatedPosts posts={relatedPosts} />
            </Reveal>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          <Reveal delay={120}>
            <ContactBanner
              title="سوالی دارید؟ با ما در ارتباط باشید"
              description="تیم پشتیبانی تک‌یار پاسخگوی سوالات شما درباره تمرین، آزمون کمربند و مسابقات است."
              actionLabel="تماس با ما"
              actionHref="/contact"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
