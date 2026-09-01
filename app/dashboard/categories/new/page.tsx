import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin-types";
import { buildCategoryTree, flattenCategoryTree } from "@/lib/blog/categories";
import { prisma } from "@/lib/prisma";

export const metadata = { title: TAXONOMY_LABELS.kinds.category.newTitle };

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, path: true, parentId: true },
  });
  const parentOptions = flattenCategoryTree(buildCategoryTree(categories)).map(({ item, depth }) => ({
    id: item.id,
    name: item.name,
    path: item.path,
    depth,
  }));

  const initial: TaxonomyInput = {
    name: "",
    slug: "",
    parentId: null,
    image: null,
    imageAlt: null,
    description: null,
    metaTitle: null,
    metaDescription: null,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{TAXONOMY_LABELS.kinds.category.newTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{TAXONOMY_LABELS.kinds.category.newDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <TaxonomyForm
          kind="category"
          mode="create"
          initial={initial}
          initialImageUrl={null}
          parentOptions={parentOptions}
        />
      </div>
    </div>
  );
}
