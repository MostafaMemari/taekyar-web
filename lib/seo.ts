import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";
import { r2PublicUrl } from "@/lib/r2-url";

interface PageSeoInput {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  publishedTime?: Date;
}

export function buildPageMetadata({
  title,
  description,
  path,
  imageUrl,
  imageAlt,
  publishedTime,
}: PageSeoInput): Metadata {
  const image = imageUrl ? r2PublicUrl(imageUrl) : undefined;
  const shared = {
    url: path,
    siteName: SITE_NAME,
    locale: "fa_IR",
    title,
    description,
    images: image ? [{ url: image, ...(imageAlt ? { alt: imageAlt } : {}) }] : undefined,
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
