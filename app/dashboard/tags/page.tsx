import { TaxonomyListPage } from "@/components/dashboard/taxonomy/taxonomy-list-page";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";

export const metadata = { title: TAXONOMY_LABELS.kinds.tag.title };

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  return <TaxonomyListPage kind="tag" searchParams={searchParams} />;
}
