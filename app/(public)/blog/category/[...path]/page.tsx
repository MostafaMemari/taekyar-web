import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { CATEGORY_PAGE_LABELS } from "@/data/blog/category-page";
import { archiveJsonLd, breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getPostsByCategory, resolveCategoryPath } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo";
import { categoryHref } from "@/lib/routes";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ path: string[] }>;
}

function decodeSegments(segments: string[]): string[] {
  return segments.map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  });
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { path } = await params;
  const resolved = await resolveCategoryPath(decodeSegments(path));

  if (resolved.status !== "found") return { title: "دسته‌بندی یافت نشد" };
  const { category } = resolved;

  return buildPageMetadata({
    title: category.metaTitle ?? category.name,
    description:
      category.metaDescription ??
      category.description ??
      `مقالات دسته‌بندی «${category.name}» در وبلاگ تک‌یار.`,
    path: categoryHref(category.path),
    imageUrl: category.image,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { path } = await params;
  const resolved = await resolveCategoryPath(decodeSegments(path));

  if (resolved.status === "missing") notFound();
  if (resolved.status === "redirect") permanentRedirect(categoryHref(resolved.category.path));

  const { category, ancestors } = resolved;
  const posts = await getPostsByCategory({ id: category.id, path: category.path });
  const breadcrumbs = [
    { name: "وبلاگ", path: "/blog" },
    ...ancestors.map((ancestor) => ({ name: ancestor.name, path: categoryHref(ancestor.path) })),
    { name: category.name, path: categoryHref(category.path) },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={archiveJsonLd({
          name: category.name,
          path: categoryHref(category.path),
          description: category.description ?? category.metaDescription,
          imageUrl: category.image,
          posts,
        })}
      />
      <TaxonomyArchive
        eyebrow={CATEGORY_PAGE_LABELS.eyebrow}
        title={category.name}
        description={category.description ?? category.metaDescription}
        imageUrl={category.image}
        posts={posts}
        seoContent={category.description}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
