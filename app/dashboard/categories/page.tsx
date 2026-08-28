import { TaxonomyListPage } from "@/components/dashboard/taxonomy/taxonomy-list-page";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";

export const metadata = { title: TAXONOMY_LABELS.kinds.category.title };

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  return <TaxonomyListPage kind="category" searchParams={searchParams} />;
}
