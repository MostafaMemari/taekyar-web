import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { getBlogPosts } from "@/lib/blog";
import { postHref } from "@/lib/routes";
import { formatFaDate, toFaDigits } from "@/lib/utils";
import { BLOG_PREVIEW_COUNT, BLOG_PREVIEW_INTRO } from "@/data/home/blog-preview";

export async function BlogPreview() {
  const posts = await getBlogPosts();
  const latest = posts.slice(0, BLOG_PREVIEW_COUNT);

  if (latest.length === 0) return null;

  return (
    <Section id="blog-preview" containerClassName="py-10 sm:py-12 lg:py-14">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-bold text-primary">{BLOG_PREVIEW_INTRO.eyebrow}</p>
            <h2 className="mt-2 text-xl font-extrabold leading-8 sm:text-2xl sm:leading-9">
              {BLOG_PREVIEW_INTRO.title}
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            مشاهده همه
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <ul className="mt-6 border-t border-border/60">
          {latest.map((post) => (
            <li key={post.id} className="border-b border-border/60">
              <Link
                href={postHref(post.slug)}
                className="group flex items-center gap-4 py-4"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </span>
                  {post.date || post.readTimeMinutes ? (
                    <span className="mt-1 flex items-center gap-x-2 text-[11px] font-medium text-muted-foreground">
                      {post.date ? <span>{formatFaDate(post.date)}</span> : null}
                      {post.date && post.readTimeMinutes ? (
                        <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
                      ) : null}
                      {post.readTimeMinutes ? (
                        <span className="inline-flex shrink-0 items-center gap-1">
                          <Clock className="size-3 shrink-0" />
                          {toFaDigits(post.readTimeMinutes)} {BLOG_INDEX_LABELS.readTimeSuffix}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </span>
                <ArrowLeft className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:-translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
