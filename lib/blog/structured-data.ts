import type { BlogPost } from "./types";
import { postHref } from "@/lib/routes";
import { r2PublicUrl } from "@/lib/r2-url";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function breadcrumbJsonLd(entries: BreadcrumbEntry[]) {
  const items = [{ name: SITE_NAME, path: "/" }, ...entries];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  const image = post.coverImage ?? post.categoryImage;
  const keywords = post.tags.map((tag) => tag.name).join("، ");

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    ...(image ? { image: r2PublicUrl(image) } : {}),
    datePublished: post.createdAt.toISOString(),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(postHref(post.slug)),
    articleSection: post.category,
    keywords,
  };
}
