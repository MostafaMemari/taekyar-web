import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
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
    seoTitle: null,
    seoDescription: null,
    keywords: null,
    canonical: null,
    robotsTags: null,
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={TAXONOMY_LABELS.kinds.category.newTitle}
        description={TAXONOMY_LABELS.kinds.category.newDescription}
      />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
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
