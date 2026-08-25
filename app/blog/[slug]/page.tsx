import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";

import { BlogCard } from "@/components/blog/blog-card";
import { PostBody } from "@/components/blog/post-body";
import { CATEGORY_STYLES } from "@/components/blog/data";
import { ContactBanner } from "@/components/shared/contact-banner";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { getPostBlocks } from "@/lib/blog-content";
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

const EDITORIAL_TEAM = "تیم تحریریه تک‌یار";
const RELATED_COUNT = 3;

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
  const { color, Icon } = CATEGORY_STYLES[post.category];
  const relatedPosts = getRelatedPosts(post.slug, post.category);

  return (
    <>
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowRight className="size-4" />
              بازگشت به وبلاگ
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge
                className="border-none text-xs font-semibold"
                style={{ backgroundColor: `${color}14`, color }}
              >
                {post.category}
              </Badge>
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="size-3.5" />
                {post.date} · {post.readTimeMinutes} دقیقه مطالعه
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                · نوشته از {EDITORIAL_TEAM}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black leading-[1.4] sm:text-4xl sm:leading-[1.3]">
              {post.title}
            </h1>

            <p className="mt-5 border-s-2 border-primary/40 ps-4 text-base leading-9 text-muted-foreground">
              {post.excerpt}
            </p>

            <div
              className="relative mt-8 h-56 w-full overflow-hidden rounded-2xl sm:h-72 lg:h-80"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]" />
              <Icon
                className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-white/25"
                strokeWidth={1.25}
              />
            </div>
          </Reveal>

          {blocks ? (
            <Reveal delay={80}>
              <div className="mt-10">
                <PostBody blocks={blocks} />
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground">برچسب‌ها:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </article>
      </Section>

      <Section containerClassName="pt-0 sm:pt-0 lg:pt-0">
        <Reveal>
          <h2 className="text-xl font-extrabold">مطالب مرتبط</h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {relatedPosts.map((related) => (
            <BlogCard key={related.id} post={related} />
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-12">
            <ContactBanner
              title="سوالی دارید؟ با ما در ارتباط باشید"
              description="تیم پشتیبانی تک‌یار پاسخگوی سوالات شما درباره تمرین، آزمون کمربند و مسابقات است."
              actionLabel="تماس با ما"
              actionHref="/contact"
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
