import type { PostInput } from "@/lib/admin-types";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { getCategories, getTags } from "@/lib/blog";

export const metadata = {
  title: POST_FORM_LABELS.newTitle,
};

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  const initial: PostInput = {
    title: "",
    slug: "",
    excerpt: "",
    categoryId: categories[0]?.id ?? 0,
    tagIds: [],
    date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
    readTimeMinutes: 5,
    content: "",
    coverImage: null,
    coverImageAlt: null,
    metaTitle: null,
    metaDescription: null,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{POST_FORM_LABELS.newTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{POST_FORM_LABELS.newDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <PostForm
          mode="create"
          initial={initial}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
}
