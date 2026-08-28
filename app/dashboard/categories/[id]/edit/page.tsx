import { notFound } from "next/navigation";

import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { r2PublicUrl } from "@/lib/r2-url";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  return {
    title: category
      ? `${TAXONOMY_LABELS.kinds.category.editTitle} — ${category.name}`
      : TAXONOMY_LABELS.kinds.category.editTitle,
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) notFound();

  const initial: TaxonomyInput = {
    name: category.name,
    slug: category.slug,
    image: category.image,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-black sm:text-2xl">{TAXONOMY_LABELS.kinds.category.editTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{TAXONOMY_LABELS.kinds.category.editDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
        <TaxonomyForm
          kind="category"
          mode="edit"
          initial={initial}
          initialImageUrl={category.image ? r2PublicUrl(category.image) : null}
          currentId={category.id}
        />
      </div>
    </div>
  );
}
