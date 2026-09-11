import { notFound } from "next/navigation";

import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { r2PublicUrl } from "@/lib/r2-url";

interface EditTagPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditTagPageProps) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id: Number(id) }, include: { seo: true } });
  return {
    title: tag
      ? `${TAXONOMY_LABELS.kinds.tag.editTitle} — ${tag.name}`
      : TAXONOMY_LABELS.kinds.tag.editTitle,
  };
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id: Number(id) }, include: { seo: true } });
  if (!tag) notFound();

  const initial: TaxonomyInput = {
    name: tag.name,
    slug: tag.slug,
    parentId: null,
    image: tag.image,
    imageAlt: tag.imageAlt,
    description: tag.description,
    seoTitle: tag.seo?.seoTitle ?? null,
    seoDescription: tag.seo?.seoDescription ?? null,
    keywords: tag.seo?.keywords ?? null,
    canonical: tag.seo?.canonical ?? null,
    robotsTags: tag.seo?.robotsTags ?? null,
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title={TAXONOMY_LABELS.kinds.tag.editTitle}
        description={TAXONOMY_LABELS.kinds.tag.editDescription}
      />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <TaxonomyForm
          kind="tag"
          mode="edit"
          initial={initial}
          initialImageUrl={tag.image ? r2PublicUrl(tag.image) : null}
          currentId={tag.id}
        />
      </div>
    </div>
  );
}
