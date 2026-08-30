import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import { breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(decodeURIComponent(slug));

  if (!category) return { title: "دسته‌بندی یافت نشد" };

  return buildPageMetadata({
    title: category.metaTitle ?? category.name,
    description:
      category.metaDescription ??
      category.description ??
      `مقالات دسته‌بندی «${category.name}» در وبلاگ تک‌یار.`,
    path: `/blog/category/${category.slug}`,
    imageUrl: category.image,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(decodeURIComponent(slug));
  if (!category) notFound();

  const posts = await getPostsByCategory(category.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "وبلاگ", path: "/blog" },
          { name: category.name, path: `/blog/category/${category.slug}` },
        ])}
      />
      <TaxonomyArchive
        eyebrow={BLOG_INDEX_LABELS.filterNav}
        title={category.name}
        description={category.metaDescription}
        imageUrl={category.image}
        posts={posts}
        backHref="/blog"
        backLabel="بازگشت به وبلاگ"
      />
    </>
  );
}