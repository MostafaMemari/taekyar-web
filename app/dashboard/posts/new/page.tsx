import type { PostInput } from "@/lib/admin/types";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { getCategories, getTags } from "@/lib/blog";
import { toCategorySelectOptions } from "@/lib/blog/categories";

export const metadata = {
  title: POST_FORM_LABELS.newTitle,
};

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  const categoryOptions = toCategorySelectOptions(categories);

  const initial: PostInput = {
    title: "",
    slug: "",
    excerpt: null,
    categoryIds: [],
    tagIds: [],
    readTimeMinutes: 5,
    content: null,
    coverImage: null,
    coverImageAlt: null,
    seoTitle: null,
    seoDescription: null,
    keywords: null,
    canonical: null,
    robotsTags: null,
    status: "PUBLISHED",
    faqs: [],
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader title={POST_FORM_LABELS.newTitle} description={POST_FORM_LABELS.newDescription} />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <PostForm
          mode="create"
          initial={initial}
          categories={categoryOptions}
          tags={tags}
        />
      </div>
    </div>
  );
}
