import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getPostsByTag, getTagBySlug } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo";
import { tagHref } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));

  if (!tag) return { title: "برچسب یافت نشد" };

  return buildPageMetadata({
    title: tag.metaTitle ?? tag.name,
    description:
      tag.metaDescription ?? tag.description ?? `مقالات و آموزش‌های مرتبط با «${tag.name}» در وبلاگ ${SITE_NAME}.`,
    path: tagHref(tag.slug),
    imageUrl: tag.image,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));
  if (!tag) notFound();

  const posts = await getPostsByTag(tag.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "وبلاگ", path: "/blog" },
          { name: tag.name, path: tagHref(tag.slug) },
        ])}
      />
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
    </>
  );
}
