import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/site-settings";
import { r2PublicUrl } from "@/lib/r2-url";

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

const BOOLEAN_ROBOTS_KEYS = new Set([
  "noarchive",
  "nosnippet",
  "noimageindex",
  "nocache",
  "notranslate",
  "indexifembedded",
  "nositelinkssearchbox",
]);

const IMAGE_PREVIEW_VALUES = new Set(["none", "standard", "large"]);

export function parseRobotsTags(value: string | null | undefined): RobotsDirectives | null {
  if (!value) return null;

  const directives: RobotsDirectives = {};
  for (const raw of value.split(/[،,]/)) {
    const entry = raw.trim().toLowerCase();
    if (!entry) continue;

    const separatorIndex = entry.indexOf(":");
    const key = separatorIndex === -1 ? entry : entry.slice(0, separatorIndex).trim();
    const rawValue = separatorIndex === -1 ? undefined : entry.slice(separatorIndex + 1).trim();

    if (key === "index") {
      directives.index = true;
    } else if (key === "noindex") {
      directives.index = false;
    } else if (key === "follow") {
      directives.follow = true;
    } else if (key === "nofollow") {
      directives.follow = false;
    } else if (key === "max-image-preview") {
      if (rawValue && IMAGE_PREVIEW_VALUES.has(rawValue)) {
        directives["max-image-preview"] = rawValue as RobotsDirectives["max-image-preview"];
      }
    } else if (key === "max-snippet") {
      const parsed = Number(rawValue);
      if (rawValue !== undefined && Number.isInteger(parsed) && parsed >= 0) {
        directives["max-snippet"] = parsed;
      }
    } else if (key === "max-video-preview") {
      if (rawValue) directives["max-video-preview"] = rawValue;
    } else if (BOOLEAN_ROBOTS_KEYS.has(key)) {
      directives[key as Exclude<keyof RobotsDirectives, "max-image-preview" | "max-snippet" | "max-video-preview">] = true;
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
