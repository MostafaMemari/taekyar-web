import type { PageInput } from "@/lib/admin-types";
import { PageForm } from "@/components/dashboard/pages/page-form";
import { PAGES_FORM_LABELS } from "@/data/dashboard/ui";

export const metadata = { title: PAGES_FORM_LABELS.newTitle };

export default function NewPageView() {
  const initial: PageInput = {
    title: "",
    slug: "",
    content: null,
    coverImage: null,
    coverImageAlt: null,
    seoTitle: null,
    seoDescription: null,
    keywords: null,
    canonical: null,
    robotsTags: null,
    status: "PUBLISHED",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{PAGES_FORM_LABELS.newTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{PAGES_FORM_LABELS.newDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <PageForm mode="create" initial={initial} />
      </div>
    </div>
  );
}
