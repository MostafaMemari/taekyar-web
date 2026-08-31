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

interface ArchiveJsonLdInput {
  name: string;
  path: string;
  description?: string | null;
  imageUrl?: string | null;
  posts: BlogPost[];
}

export function archiveJsonLd({ name, path, description, imageUrl, posts }: ArchiveJsonLdInput) {
  const image = imageUrl ? r2PublicUrl(imageUrl) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: absoluteUrl(path),
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(postHref(post.slug)),
        name: post.title,
      })),
    },
  };
}

export function articleJsonLd(post: BlogPost) {
  const image = post.coverImage ?? post.categoryImage;
  const keywords = post.tags.map((tag) => tag.name).join("، ");
  const description = post.metaDescription ?? post.excerpt;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(description ? { description } : {}),
    ...(image ? { image: r2PublicUrl(image) } : {}),
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(postHref(post.slug)),
    ...(post.category ? { articleSection: post.category } : {}),
    ...(keywords ? { keywords } : {}),
  };
}
