export const dashboardHref = (): string => `/dashboard`;

export const postHref = (slug: string): string => `/blog/${encodePathSegments(slug)}`;

export const postEditHref = (slug: string): string => `/dashboard/posts/${slug}/edit`;

export const categoryHref = (path: string): string =>
  `/blog/category/${encodePathSegments(path)}`;

export const categoryEditHref = (id: number): string => `/dashboard/categories/${id}/edit`;

export const tagHref = (slug: string): string => `/blog/tag/${encodePathSegments(slug)}`;

export const tagEditHref = (id: number): string => `/dashboard/tags/${id}/edit`;

function encodePathSegments(value: string): string {
  return value.split("/").map(encodeURIComponent).join("/");
}

export const sitemapHref = (id: string): string => `/sitemap/${id}.xml`;

export const PATHNAME_HEADER = "x-taekyar-pathname";
