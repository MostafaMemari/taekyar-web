import type { ResolvedSeo, SeoOverrides } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

interface SeoFallbacks {
  title: string;
  description?: string | null;
  defaultDescription?: string | null;
  canonicalPath: string;
}

function toAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

/**
 * Resolves SEO data with a three-tier fallback:
 * 1. explicit override entered by the admin (never persisted when empty)
 * 2. the entity's own data
 * 3. a safe generated/default value
 */
export function resolveSeo(
  overrides: SeoOverrides | null | undefined,
  { title, description, defaultDescription, canonicalPath }: SeoFallbacks,
): ResolvedSeo {
  const seoTitle = overrides?.seoTitle?.trim();
  const seoDescription = overrides?.seoDescription?.trim();
  const keywords = overrides?.keywords?.trim();
  const canonical = overrides?.canonical?.trim();

  return {
    title: seoTitle || title,
    description: seoDescription || description?.trim() || defaultDescription?.trim() || null,
    keywords: keywords || null,
    canonical: toAbsoluteUrl(canonical || canonicalPath),
  };
}
