import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin-types";

export const metadata = { title: TAXONOMY_LABELS.kinds.tag.newTitle };

export default function NewTagPage() {
  const initial: TaxonomyInput = {
    name: "",
    slug: "",
    image: null,
    description: null,
    metaTitle: null,
    metaDescription: null,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{TAXONOMY_LABELS.kinds.tag.newTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{TAXONOMY_LABELS.kinds.tag.newDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
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
