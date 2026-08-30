export const postHref = (slug: string): string => `/blog/${slug}`;

export const categoryHref = (path: string): string =>
  `/blog/category/${path.split("/").map(encodeURIComponent).join("/")}`;

export const tagHref = (slug: string): string => `/blog/tag/${slug}`;
