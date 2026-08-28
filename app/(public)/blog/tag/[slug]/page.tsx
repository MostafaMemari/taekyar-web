import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { getPostsByTag, getTagBySlug } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));

  if (!tag) return { title: "برچسب یافت نشد" };

  const title = tag.metaTitle ?? tag.name;
  const description =
    tag.metaDescription ?? tag.description ?? `مقالات و آموزش‌های مرتبط با «${tag.name}» در وبلاگ ${SITE_NAME}.`;
  const path = `/blog/tag/${tag.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: SITE_NAME,
      locale: "fa_IR",
      title,
      description,
      images: tag.image ? [{ url: r2PublicUrl(tag.image) }] : undefined,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));
  if (!tag) notFound();

  const posts = await getPostsByTag(tag.id);

  return (
    <TaxonomyArchive
      eyebrow={TAG_PAGE_LABELS.eyebrow}
      title={tag.name}
      description={tag.description ?? tag.metaDescription}
      imageUrl={tag.image}
      posts={posts}
      seoContent={tag.description}
      backHref="/blog"
      backLabel="بازگشت به وبلاگ"
    />
  );
}