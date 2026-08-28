import { notFound } from "next/navigation";

import { TaxonomyForm } from "@/components/dashboard/taxonomy/taxonomy-form";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { TaxonomyInput } from "@/lib/admin-types";
import { prisma } from "@/lib/prisma";
import { r2PublicUrl } from "@/lib/r2-url";

interface EditTagPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditTagPageProps) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id: Number(id) } });
  return {
    title: tag
      ? `${TAXONOMY_LABELS.kinds.tag.editTitle} — ${tag.name}`
      : TAXONOMY_LABELS.kinds.tag.editTitle,
  };
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id: Number(id) } });
  if (!tag) notFound();

  const initial: TaxonomyInput = {
    name: tag.name,
    slug: tag.slug,
    image: tag.image,
    metaTitle: tag.metaTitle,
    metaDescription: tag.metaDescription,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{TAXONOMY_LABELS.kinds.tag.editTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{TAXONOMY_LABELS.kinds.tag.editDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
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
