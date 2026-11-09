import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";

import { Section } from "@/components/shared/section";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { getBlogPosts } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";
import { postHref } from "@/lib/routes";
import { formatFaDate } from "@/lib/utils";
import { BLOG_SECTION } from "@/data/home/landing";

const COUNT = 4;

export async function BlogPreview() {
  const posts = await getBlogPosts();
  const latest = posts.slice(0, COUNT);

  return (
    <Section id="blog-preview" tone="default" className="bg-[#f5f1ea]">
      
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
              {BLOG_SECTION.title}
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-8 text-black/55">
              {BLOG_SECTION.description}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/[0.09] bg-white px-5 text-sm font-bold text-[#1b2330] shadow-sm transition-colors duration-200 hover:border-[#E0A800]/50 hover:text-[#a37800]"
          >
            {BLOG_SECTION.actionLabel}
            <ArrowLeft className="!size-4" />
          </Link>
        </div>
      

      {latest.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((post) => (
            <li key={post.id}>
              
                <Link
                  href={postHref(post.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={r2PublicUrl(post.coverImage)}
                        alt={post.coverImageAlt || post.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <ImagePlaceholder icon={Newspaper} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {post.category ? (
                        <span className="rounded-full bg-[#FDF3D7] px-2.5 py-1 text-[11px] font-bold text-[#8a6a00]">
                          {post.category}
                        </span>
                      ) : null}
                      {post.date ? (
                        <span className="text-[11px] font-medium text-black/45">
                          {formatFaDate(post.date)}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2.5 text-[15px] font-extrabold leading-7 text-[#1b2330] transition-colors duration-200 group-hover:text-[#a37800]">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
