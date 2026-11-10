import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin/types";

export const metadata = { title: TAXONOMY_LABELS.kinds.tag.newTitle };

export default function NewTagPage() {
  const initial: TaxonomyInput = {
    name: "",
    slug: "",
    parentId: null,
    image: null,
    imageAlt: null,
    description: null,
    seoTitle: null,
    seoDescription: null,
    keywords: null,
    canonical: null,
    robotsTags: null,
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={TAXONOMY_LABELS.kinds.tag.newTitle}
        description={TAXONOMY_LABELS.kinds.tag.newDescription}
      />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <TaxonomyForm
          kind="tag"
          mode="create"
          initial={initial}
          initialImageUrl={null}
        />
      </div>
    </div>
  );
}
