import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag } from "lucide-react";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { BLOG_PAGINATION } from "@/data/blog/index-page";
import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { archiveJsonLd, breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getPaginatedPostsByTag, getTagBySlug } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo";
import { resolveSeo } from "@/lib/seo-resolve";
import { htmlToPlainText } from "@/lib/post-content";
import { tagHref } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";
import { toFaDigits } from "@/lib/utils";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function resolvePage(value?: string): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function pageHref(basePath: string, page: number): string {
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}

export async function generateMetadata({ params, searchParams }: TagPageProps): Promise<Metadata> {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const tag = await getTagBySlug(decodeSegment(slug));

  if (!tag) return { title: "برچسب یافت نشد" };

  const requestedPage = resolvePage(page);
  const basePath = tagHref(tag.slug);
  const { totalCount } = await getPaginatedPostsByTag(
    tag.id,
    { page: requestedPage, perPage: BLOG_PAGINATION.postsPerPage },
  );
  const totalPages = Math.max(1, Math.ceil(totalCount / BLOG_PAGINATION.postsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);

  const plainDescription = tag.description ? htmlToPlainText(tag.description) : null;

  const seo = resolveSeo(tag.seo, {
    title: currentPage > 1 ? `${tag.name} · صفحه ${toFaDigits(currentPage)}` : tag.name,
    description: plainDescription,
    defaultDescription: `مقالات و آموزش‌های مرتبط با «${tag.name}» در وبلاگ ${SITE_NAME}.`,
    canonicalPath: basePath,
  });

  const paginatedPath = pageHref(basePath, currentPage);

  return buildPageMetadata({
    ...seo,
    ...(currentPage > 1 && !tag.seo?.canonical?.trim()
      ? { canonical: paginatedPath }
      : {}),
    path: paginatedPath,
    imageUrl: tag.image,
    imageAlt: tag.imageAlt ?? tag.name,
  });
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const [{ slug }, { page }] = await Promise.all([params, searchParams]);
  const tag = await getTagBySlug(decodeSegment(slug));
  if (!tag) notFound();

  const basePath = tagHref(tag.slug);
  const requestedPage = resolvePage(page);
  const firstFetch = await getPaginatedPostsByTag(
    tag.id,
    { page: requestedPage, perPage: BLOG_PAGINATION.postsPerPage },
  );
  const totalPages = Math.max(1, Math.ceil(firstFetch.totalCount / BLOG_PAGINATION.postsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);
  const { posts: visiblePosts } =
    currentPage === requestedPage
      ? firstFetch
      : await getPaginatedPostsByTag(
          tag.id,
          { page: currentPage, perPage: BLOG_PAGINATION.postsPerPage },
        );
  const totalCount = firstFetch.totalCount;
  const breadcrumbs = [
    { name: "وبلاگ", path: "/blog" },
    { name: tag.name, path: basePath },
  ];
  const plainDescription = tag.description ? htmlToPlainText(tag.description) : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={archiveJsonLd({
          name: tag.name,
          path: pageHref(basePath, currentPage),
          description: plainDescription,
          imageUrl: tag.image,
          posts: visiblePosts,
          totalCount,
        })}
      />
      <TaxonomyArchive
        eyebrow={TAG_PAGE_LABELS.eyebrow}
        title={tag.name}
        description={tag.description}
        imageUrl={tag.image}
        imageAlt={tag.imageAlt}
        placeholderIcon={Tag}
        posts={visiblePosts}
        totalCount={totalCount}
        breadcrumbs={breadcrumbs}
        pagination={{
          currentPage,
          totalPages,
          hrefFor: (targetPage) => pageHref(basePath, targetPage),
        }}
      />
    </>
  );
}
