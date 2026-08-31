export const dashboardHref = (): string => `/dashboard`;

export const postHref = (slug: string): string => `/blog/${slug}`;

export const postEditHref = (slug: string): string => `/dashboard/posts/${slug}/edit`;

export const categoryHref = (path: string): string =>
  `/blog/category/${path.split("/").map(encodeURIComponent).join("/")}`;

export const categoryEditHref = (id: number): string => `/dashboard/categories/${id}/edit`;

export const tagHref = (slug: string): string => `/blog/tag/${slug}`;

export const tagEditHref = (id: number): string => `/dashboard/tags/${id}/edit`;

export const PATHNAME_HEADER = "x-taekyar-pathname";
