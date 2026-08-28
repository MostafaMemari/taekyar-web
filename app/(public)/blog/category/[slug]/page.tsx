import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(decodeURIComponent(slug));

  if (!category) return { title: "دسته‌بندی یافت نشد" };

  return {
    title: category.metaTitle ?? category.name,
    description: category.metaDescription ?? undefined,
    openGraph: category.image
      ? { images: [{ url: r2PublicUrl(category.image) }] }
      : undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(decodeURIComponent(slug));
  if (!category) notFound();

  const posts = await getPostsByCategory(category.id);

  return (
    <TaxonomyArchive
      eyebrow={BLOG_INDEX_LABELS.filterNav}
      title={category.name}
      description={category.metaDescription}
      imageUrl={category.image}
      posts={posts}
      backHref="/blog"
      backLabel="بازگشت به وبلاگ"
    />
  );
}