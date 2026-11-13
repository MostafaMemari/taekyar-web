import type { PageInput } from "@/lib/admin/types";
import { PageForm } from "@/components/dashboard/pages/page-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
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
      <DashboardPageHeader title={PAGES_FORM_LABELS.newTitle} description={PAGES_FORM_LABELS.newDescription} />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <PageForm mode="create" initial={initial} />
      </div>
    </div>
  );
}
