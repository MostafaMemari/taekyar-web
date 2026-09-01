import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/site-settings";
import { r2PublicUrl } from "@/lib/r2-url";

interface PageSeoInput {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  publishedTime?: Date;
}

export async function buildPageMetadata({
  title,
  description,
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
  const shared = {
    url: path,
    siteName: settings.siteName,
    locale: "fa_IR",
    title,
    description,
    images: image ? [{ url: image, ...(resolvedImageAlt ? { alt: resolvedImageAlt } : {}) }] : undefined,
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: publishedTime
      ? { ...shared, type: "article", publishedTime: publishedTime.toISOString() }
      : { ...shared, type: "website" },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
