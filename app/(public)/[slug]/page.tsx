import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";

import { JsonLd } from "@/components/shared/json-ld";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { getPublishedPageBySlug, pageMetaDescriptionFallback } from "@/lib/pages";
import { parsePostHtml } from "@/lib/post-content";
import { buildPageMetadata } from "@/lib/seo";
import { resolveSeo } from "@/lib/seo-resolve";
import { pageHref } from "@/lib/routes";
import { r2PublicUrl } from "@/lib/r2-url";
import { SITE_NAME } from "@/lib/site";

interface StaticPageProps {
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

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(decodeParam(slug));

  if (!page) return { title: "برگه یافت نشد" };

  const seo = resolveSeo(page.seo, {
    title: page.title,
    description: pageMetaDescriptionFallback(page.content),
    canonicalPath: pageHref(page.slug),
  });

  return buildPageMetadata({
    ...seo,
    path: pageHref(page.slug),
    imageUrl: page.coverImage,
    imageAlt: page.coverImageAlt ?? page.title,
    publishedTime: page.publishedAt ?? page.createdAt,
  });
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(decodeParam(slug));

  if (!page) notFound();

  const content = parsePostHtml(page.content);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          url: pageHref(page.slug),
          ...(page.coverImage ? { image: r2PublicUrl(page.coverImage) } : {}),
          datePublished: (page.publishedAt ?? page.createdAt).toISOString(),
          dateModified: page.updatedAt.toISOString(),
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <header className="border-b border-black/[0.06] pb-5 sm:pb-6">
              <h1 className="text-balance text-[1.65rem] font-black leading-[1.35] tracking-tight sm:text-[2rem] sm:leading-[1.35] lg:text-[2.35rem]">
                {page.title}
              </h1>
            </header>
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-6 sm:pt-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-black/[0.06]">
            {page.coverImage ? (
              <Image
                src={r2PublicUrl(page.coverImage)}
                alt={page.coverImageAlt || page.title}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder icon={FileText} label={page.title} className="rounded-2xl" iconClassName="size-16 sm:size-20" />
            )}
          </div>

          <Reveal delay={80}>
            <div className="mt-6 rounded-2xl bg-card p-4 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6 lg:p-10">
              <article
                className="article-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
