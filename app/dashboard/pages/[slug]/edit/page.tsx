import { notFound } from "next/navigation";

import type { PageInput } from "@/lib/admin-types";
import { PageForm } from "@/components/dashboard/pages/page-form";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { PAGES_FORM_LABELS } from "@/data/dashboard/ui";
import { getPageBySlugForAdmin } from "@/lib/pages";
import { r2PublicUrl } from "@/lib/r2-url";

export const dynamic = "force-dynamic";

interface EditPageViewProps {
  params: Promise<{ slug: string }>;
}

function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: EditPageViewProps) {
  const { slug } = await params;
  const page = await getPageBySlugForAdmin(decodeParam(slug));
  return { title: page ? `${PAGES_FORM_LABELS.editTitle} — ${page.title}` : PAGES_FORM_LABELS.editTitle };
}

export default async function EditPageView({ params }: EditPageViewProps) {
  const { slug } = await params;
  const page = await getPageBySlugForAdmin(decodeParam(slug));
  if (!page) notFound();

  const initial: PageInput = {
    title: page.title,
    slug: page.slug,
    content: page.content,
    coverImage: page.coverImage,
    coverImageAlt: page.coverImageAlt,
    seoTitle: page.seo?.seoTitle ?? null,
    seoDescription: page.seo?.seoDescription ?? null,
    keywords: page.seo?.keywords ?? null,
    canonical: page.seo?.canonical ?? null,
    robotsTags: page.seo?.robotsTags ?? null,
    status: page.status,
  };

  return (
    <div className="space-y-5">
      <DashboardPageHeader title={PAGES_FORM_LABELS.editTitle} description={PAGES_FORM_LABELS.editDescription} />

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <PageForm
          mode="edit"
          initial={initial}
          initialCoverUrl={page.coverImage ? r2PublicUrl(page.coverImage) : null}
          currentSlug={page.slug}
        />
      </div>
    </div>
  );
}
