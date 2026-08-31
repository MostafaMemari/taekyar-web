import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { archiveJsonLd, breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getPostsByTag, getTagBySlug } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo";
import { tagHref } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeSegment(slug));

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
  const tag = await getTagBySlug(decodeSegment(slug));
  if (!tag) notFound();

  const posts = await getPostsByTag(tag.id);
  const breadcrumbs = [
    { name: "وبلاگ", path: "/blog" },
    { name: tag.name, path: tagHref(tag.slug) },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={archiveJsonLd({
          name: tag.name,
          path: tagHref(tag.slug),
          description: tag.description ?? tag.metaDescription,
          imageUrl: tag.image,
          posts,
        })}
      />
      <TaxonomyArchive
        eyebrow={TAG_PAGE_LABELS.eyebrow}
        title={tag.name}
        description={tag.description ?? tag.metaDescription}
        imageUrl={tag.image}
        posts={posts}
        seoContent={tag.description}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
