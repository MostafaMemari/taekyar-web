import type { MetadataRoute } from "next";

import {
  getBlogSitemapEntries,
  getCategorySitemapEntries,
  getTagSitemapEntries,
} from "@/lib/blog";
import { categoryHref, postHref, tagHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";

const PAGES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
];

const PAGE_IDS = new Set(["pages"]);

function parseId(id: string): { section: string; chunk: number } {
  const match = /^(.*?)(?:-(\d+))?$/.exec(id);
  const section = match?.[1] ?? id;
  const chunk = Number(match?.[2] ?? "1");
  return { section, chunk: Number.isInteger(chunk) && chunk > 0 ? chunk : 1 };
}

export async function generateSitemaps(): Promise<{ id: string }[]> {
  const { buildSitemapSectionIds, getSitemapSectionCounts } = await import("@/lib/blog");
  const counts = await getSitemapSectionCounts();
  return buildSitemapSectionIds(counts).map((id) => ({ id }));
}
export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const raw = await id;
  const { section, chunk } = parseId(raw);

  if (PAGE_IDS.has(section)) return PAGES;

  if (section === "blog") {
    const posts = await getBlogSitemapEntries(chunk);
    return posts.map((post) => ({
      url: `${SITE_URL}${postHref(post.slug)}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  }

  if (section === "categories") {
    const categories = await getCategorySitemapEntries(chunk);
    return categories.map((category) => ({
      url: `${SITE_URL}${categoryHref(category.path)}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  }

  if (section === "tags") {
    const tags = await getTagSitemapEntries(chunk);
    return tags.map((tag) => ({
      url: `${SITE_URL}${tagHref(tag.slug)}`,
      lastModified: tag.updatedAt,
      changeFrequency: "weekly",
      priority: 0.4,
    }));
  }

  return [];
}
