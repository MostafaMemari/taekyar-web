import { notFound } from "next/navigation";

import type { PostInput } from "@/lib/admin-types";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { getCategories, getPostBySlugForAdmin, getTags } from "@/lib/blog";
import { toCategorySelectOptions } from "@/lib/blog/categories";
import { r2PublicUrl } from "@/lib/r2-url";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlugForAdmin(decodeParam(slug));
  return { title: post ? `${POST_FORM_LABELS.editTitle} — ${post.title}` : POST_FORM_LABELS.editTitle };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const [post, categories, tags] = await Promise.all([
    getPostBySlugForAdmin(decodeParam(slug)),
    getCategories(),
    getTags(),
  ]);
  if (!post) notFound();
  const categoryOptions = toCategorySelectOptions(categories);

  const initial: PostInput = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    categoryIds: post.categories.map((category) => category.id),
    tagIds: post.tags.map((tag) => tag.id),
    readTimeMinutes: post.readTimeMinutes,
    content: post.content,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    seoTitle: post.seo?.seoTitle ?? null,
    seoDescription: post.seo?.seoDescription ?? null,
    keywords: post.seo?.keywords ?? null,
    canonical: post.seo?.canonical ?? null,
    robotsTags: post.seo?.robotsTags ?? null,
    status: post.status,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{POST_FORM_LABELS.editTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{POST_FORM_LABELS.editDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <PostForm
          mode="edit"
          initial={initial}
          initialCoverUrl={post.coverImage ? r2PublicUrl(post.coverImage) : null}
          currentSlug={post.slug}
          categories={categoryOptions}
          tags={tags}
        />
      </div>
    </div>
  );
}
