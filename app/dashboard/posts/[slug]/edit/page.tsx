import { notFound } from "next/navigation";

import type { PostInput } from "@/lib/admin-types";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { getPostBySlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? `${POST_FORM_LABELS.editTitle} — ${post.title}` : POST_FORM_LABELS.editTitle };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const initial: PostInput = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    date: post.date,
    readTimeMinutes: post.readTimeMinutes,
    content: post.content,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-black sm:text-2xl">{POST_FORM_LABELS.editTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{POST_FORM_LABELS.editDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <PostForm mode="edit" initial={initial} currentSlug={post.slug} />
      </div>
    </div>
  );
}
