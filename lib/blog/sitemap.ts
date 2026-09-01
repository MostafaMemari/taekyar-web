import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { PUBLIC_POST_WHERE } from "./posts";

export const SITEMAP_URLS_PER_FILE = 50_000;

export interface SitemapSectionCounts {
  blog: number;
  categories: number;
  tags: number;
}

export interface SitemapIndexEntry {
  id: string;
  lastmod: Date | null;
}

export function buildSitemapSectionIds(counts: SitemapSectionCounts): string[] {
  const ids: string[] = ["pages"];
  const sections: [name: string, count: number][] = [
    ["blog", counts.blog],
    ["categories", counts.categories],
    ["tags", counts.tags],
  ];
  for (const [name, count] of sections) {
    const chunks = Math.max(1, Math.ceil(count / SITEMAP_URLS_PER_FILE));
    for (let chunk = 1; chunk <= chunks; chunk += 1) {
      ids.push(chunk === 1 ? name : `${name}-${chunk}`);
    }
  }
  return ids;
}

export const getSitemapSectionCounts = cache(async (): Promise<SitemapSectionCounts> => {
  try {
    const [blog, categories, tags] = await Promise.all([
      prisma.post.count({ where: PUBLIC_POST_WHERE }),
      prisma.category.count(),
      prisma.tag.count(),
    ]);
    return { blog, categories, tags };
  } catch {
    return { blog: 0, categories: 0, tags: 0 };
  }
});

export const getSitemapIndexEntries = cache(async (): Promise<SitemapIndexEntry[]> => {
  try {
    const [counts, blog, categories, tags] = await Promise.all([
      getSitemapSectionCounts(),
      prisma.post.aggregate({ _max: { updatedAt: true }, where: PUBLIC_POST_WHERE }),
      prisma.category.aggregate({ _max: { updatedAt: true } }),
      prisma.tag.aggregate({ _max: { updatedAt: true } }),
    ]);
    const lastmods: Record<string, Date | null> = {
      blog: blog._max.updatedAt,
      categories: categories._max.updatedAt,
      tags: tags._max.updatedAt,
    };
    return buildSitemapSectionIds(counts).map((id) => ({ id, lastmod: lastmods[id.split("-")[0]] ?? null }));
  } catch {
    return [];
  }
});

export interface SitemapSlugEntry {
  slug: string;
  updatedAt: Date;
}

export const getBlogSitemapEntries = cache(async (chunk: number): Promise<SitemapSlugEntry[]> => {
  try {
    const posts = await prisma.post.findMany({
      where: PUBLIC_POST_WHERE,
      orderBy: { id: "asc" },
      select: { slug: true, updatedAt: true },
      skip: (chunk - 1) * SITEMAP_URLS_PER_FILE,
      take: SITEMAP_URLS_PER_FILE,
    });
    return posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch {
    return [];
  }
});

export interface SitemapPathEntry {
  path: string;
  updatedAt: Date;
}

export const getCategorySitemapEntries = cache(async (chunk: number): Promise<SitemapPathEntry[]> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { path: true, updatedAt: true },
      skip: (chunk - 1) * SITEMAP_URLS_PER_FILE,
      take: SITEMAP_URLS_PER_FILE,
    });
    return categories.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch {
    return [];
  }
});

export const getTagSitemapEntries = cache(async (chunk: number): Promise<SitemapSlugEntry[]> => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { id: "asc" },
      select: { slug: true, updatedAt: true },
      skip: (chunk - 1) * SITEMAP_URLS_PER_FILE,
      take: SITEMAP_URLS_PER_FILE,
    });
    return tags.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch {
    return [];
  }
});
