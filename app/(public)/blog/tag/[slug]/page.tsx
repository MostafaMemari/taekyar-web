import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TaxonomyArchive } from "@/components/blog/taxonomy-archive";
import { getPostsByTag, getTagBySlug } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));

  if (!tag) return { title: "برچسب یافت نشد" };

  return {
    title: tag.metaTitle ?? tag.name,
    description: tag.metaDescription ?? undefined,
    openGraph: tag.image
      ? { images: [{ url: r2PublicUrl(tag.image) }] }
      : undefined,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(decodeURIComponent(slug));
  if (!tag) notFound();

  const posts = await getPostsByTag(tag.id);

  return (
    <TaxonomyArchive
      eyebrow="برچسب"
      title={`مقالات با برچسب «${tag.name}»`}
      description={tag.metaDescription}
      imageUrl={tag.image}
      posts={posts}
      backHref="/blog"
      backLabel="بازگشت به وبلاگ"
    />
  );
}