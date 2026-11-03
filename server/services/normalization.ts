export function normalizeOptionalText(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

export interface NormalizedSeo {
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string | null;
  canonical: string | null;
  robotsTags: string | null;
}

export function hasSeoData(seo: NormalizedSeo): boolean {
  return (
    seo.seoTitle !== null ||
    seo.seoDescription !== null ||
    seo.keywords !== null ||
    seo.canonical !== null ||
    seo.robotsTags !== null
  );
}

export function normalizeSeoInput(input: {
  seoTitle?: unknown;
  seoDescription?: unknown;
  keywords?: unknown;
  canonical?: unknown;
  robotsTags?: unknown;
}): NormalizedSeo {
  return {
    seoTitle: normalizeOptionalText(input.seoTitle),
    seoDescription: normalizeOptionalText(input.seoDescription),
    keywords: normalizeOptionalText(input.keywords),
    canonical: normalizeOptionalText(input.canonical),
    robotsTags: normalizeOptionalText(input.robotsTags),
  };
}
