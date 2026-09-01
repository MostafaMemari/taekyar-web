import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "lucide-react";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { archiveJsonLd, breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getPostsByTag, getTagBySlug } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo";
import { resolveSeo } from "@/lib/seo-resolve";
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

  const seo = resolveSeo(tag.seo, {
    title: tag.name,
    description: tag.description,
    defaultDescription: `مقالات و آموزش‌های مرتبط با «${tag.name}» در وبلاگ ${SITE_NAME}.`,
    canonicalPath: tagHref(tag.slug),
  });

  return buildPageMetadata({
    ...seo,
    path: tagHref(tag.slug),
    imageUrl: tag.image,
    imageAlt: tag.imageAlt ?? tag.name,
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
          description: tag.description,
          imageUrl: tag.image,
          posts,
        })}
      />
      <TaxonomyArchive
        eyebrow={TAG_PAGE_LABELS.eyebrow}
        title={tag.name}
        description={tag.description}
        imageUrl={tag.image}
        imageAlt={tag.imageAlt}
        placeholderIcon={Tag}
        posts={posts}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
