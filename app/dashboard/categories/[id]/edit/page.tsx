import { notFound } from "next/navigation";

import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin/types";
import { buildCategoryTree, flattenCategoryTree } from "@/lib/blog/categories";
import { prisma } from "@/lib/prisma";
import { r2PublicUrl } from "@/lib/media/r2-url";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) }, include: { seo: true } });
  return {
    title: category
      ? `${TAXONOMY_LABELS.kinds.category.editTitle} — ${category.name}`
      : TAXONOMY_LABELS.kinds.category.editTitle,
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) }, include: { seo: true } });
  if (!category) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, path: true, parentId: true },
  });
  const parentOptions = flattenCategoryTree(
    buildCategoryTree(
      categories.filter(
        (item) => item.id !== category.id && !item.path.startsWith(`${category.path}/`),
      ),
    ),
  ).map(({ item, depth }) => ({ id: item.id, name: item.name, path: item.path, depth }));

  const initial: TaxonomyInput = {
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
    image: category.image,
    imageAlt: category.imageAlt,
    description: category.description,
    seoTitle: category.seo?.seoTitle ?? null,
    seoDescription: category.seo?.seoDescription ?? null,
    keywords: category.seo?.keywords ?? null,
    canonical: category.seo?.canonical ?? null,
    robotsTags: category.seo?.robotsTags ?? null,
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={TAXONOMY_LABELS.kinds.category.editTitle}
        description={TAXONOMY_LABELS.kinds.category.editDescription}
      />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <TaxonomyForm
          kind="category"
          mode="edit"
          initial={initial}
          initialImageUrl={category.image ? r2PublicUrl(category.image) : null}
          currentId={category.id}
          parentOptions={parentOptions}
        />
      </div>
    </div>
  );
}
