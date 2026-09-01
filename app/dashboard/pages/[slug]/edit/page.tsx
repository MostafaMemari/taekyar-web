import { notFound } from "next/navigation";

import type { PageInput } from "@/lib/admin-types";
import { PageForm } from "@/components/dashboard/pages/page-form";
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
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{PAGES_FORM_LABELS.editTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{PAGES_FORM_LABELS.editDescription}</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-6">
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
