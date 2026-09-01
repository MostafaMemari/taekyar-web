import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/site-settings";
import { r2PublicUrl } from "@/lib/r2-url";
import { composeRobotsTags, parseRobotsUiState } from "@/lib/seo-robots";

export interface SeoOverrides {
  seoTitle?: string | null;
  seoDescription?: string | null;
  keywords?: string | null;
  canonical?: string | null;
  robotsTags?: string | null;
}

export interface ResolvedSeo {
  title: string;
  description: string | null;
  keywords: string | null;
  canonical: string;
  robots: RobotsDirectives | null;
}

export interface RobotsDirectives {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;
  notranslate?: boolean;
  indexifembedded?: boolean;
  nositelinkssearchbox?: boolean;
  "max-image-preview"?: "none" | "standard" | "large";
  "max-snippet"?: number;
  "max-video-preview"?: number | string;
}

export function parseRobotsTags(value: string | null | undefined): RobotsDirectives | null {
  if (!value) return null;

  const state = parseRobotsUiState(value);
  const tags = composeRobotsTags(state);
  if (!tags) return null;

  const directives: RobotsDirectives = {};
  for (const entry of tags.split(",")) {
    const [key, rawValue] = entry.split(":");
    if (key === "index") directives.index = true;
    else if (key === "noindex") directives.index = false;
    else if (key === "follow") directives.follow = true;
    else if (key === "nofollow") directives.follow = false;
    else if (key === "max-image-preview") {
      if (rawValue === "none" || rawValue === "standard" || rawValue === "large") {
        directives["max-image-preview"] = rawValue;
      }
    } else if (key === "max-snippet") {
      const parsed = Number(rawValue);
      if (Number.isInteger(parsed)) directives["max-snippet"] = parsed;
    } else if (key === "max-video-preview") {
      const parsed = Number(rawValue);
      if (Number.isInteger(parsed)) directives["max-video-preview"] = parsed;
    }
  }

  return Object.keys(directives).length > 0 ? directives : null;
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
  robots,
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
    robots: robots ?? undefined,
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
