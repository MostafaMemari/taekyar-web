import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/site-settings";
import { r2PublicUrl } from "@/lib/r2-url";

export interface SeoOverrides {
  seoTitle?: string | null;
  seoDescription?: string | null;
  keywords?: string | null;
  canonical?: string | null;
}

export interface ResolvedSeo {
  title: string;
  description: string | null;
  keywords: string | null;
  canonical: string;
}

interface PageSeoInput extends ResolvedSeo {
  path: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  publishedTime?: Date;
}

export async function buildPageMetadata({
  title,
  description,
  keywords,
  canonical,
  path,
  imageUrl,
  imageAlt,
  publishedTime,
}: PageSeoInput): Promise<Metadata> {
  const settings = await getSiteSettings();
  const resolvedImageKey = imageUrl ?? settings.ogImage.key;
  const image = resolvedImageKey ? r2PublicUrl(resolvedImageKey) : undefined;
  const resolvedImageAlt = image
    ? imageUrl
      ? imageAlt ?? undefined
      : settings.ogImage.alt ?? undefined
    : undefined;
  const canonicalUrl = canonical ?? path;
  const shared = {
    url: path,
    siteName: settings.siteName,
    locale: "fa_IR",
    title,
    description: description ?? undefined,
    images: image ? [{ url: image, ...(resolvedImageAlt ? { alt: resolvedImageAlt } : {}) }] : undefined,
  };

  return {
    title,
    description: description ?? undefined,
    keywords: keywords ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: publishedTime
      ? { ...shared, type: "article", publishedTime: publishedTime.toISOString() }
      : { ...shared, type: "website" },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: description ?? undefined,
      images: image ? [image] : undefined,
    },
  };
}
