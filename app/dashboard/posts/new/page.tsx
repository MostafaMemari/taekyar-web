import type { PostInput } from "@/lib/admin-types";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { blogCategories } from "@/data/blog/categories";

export const metadata = {
  title: POST_FORM_LABELS.newTitle,
};

export default function NewPostPage() {
  const initial: PostInput = {
    title: "",
    slug: "",
    excerpt: "",
    category: blogCategories[0],
    tags: [],
    date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
    readTimeMinutes: 5,
    content: [{ type: "paragraph", text: "" }],
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-black sm:text-2xl">{POST_FORM_LABELS.newTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{POST_FORM_LABELS.newDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <PostForm mode="create" initial={initial} />
      </div>
    </div>
  );
}
