import { cache } from "react";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { PostPublishStatus } from "@/lib/admin-types";
import { parsePostHtml } from "@/lib/post-content";

export type PageWithSeo = Prisma.PageGetPayload<{ include: { seo: true } }>;

export const PUBLIC_PAGE_WHERE = { status: "PUBLISHED" } as const;

export const PAGE_INCLUDE = { seo: true } as const;

export interface PageData {
  id: number;
  slug: string;
  title: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  seo: PageWithSeo["seo"];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageWithContent extends PageData {
  content: string;
}

function toPageData(page: PageWithSeo): PageData {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    coverImage: page.coverImage,
    coverImageAlt: page.coverImageAlt,
    seo: page.seo,
    publishedAt: page.publishedAt,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export const getPublishedPageBySlug = cache(async (slug: string): Promise<PageWithContent | null> => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: PAGE_INCLUDE,
    });
    if (!page || page.status !== "PUBLISHED") return null;
    return { ...toPageData(page), content: parsePostHtml(page.content) };
  } catch {
    return null;
  }
});

export const getPageBySlugForAdmin = cache(async (slug: string): Promise<(PageWithContent & { status: PostPublishStatus }) | null> => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
      include: PAGE_INCLUDE,
    });
    if (!page) return null;
    return { ...toPageData(page), status: page.status, content: parsePostHtml(page.content) };
  } catch {
    return null;
  }
});

const EXCERPT_LENGTH = 160;

export function pageMetaDescriptionFallback(content: string): string | null {
  const text = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length === 0) return null;
  return text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text;
}

export interface PageSitemapEntry {
  slug: string;
  updatedAt: Date;
}

export const getPageSitemapEntries = cache(
  async ({ skip, take }: { skip: number; take: number }): Promise<PageSitemapEntry[]> => {
    try {
      const pages = await prisma.page.findMany({
        where: PUBLIC_PAGE_WHERE,
        orderBy: { id: "asc" },
        select: { slug: true, updatedAt: true },
        skip,
        take,
      });
      return pages.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch {
      return [];
    }
  },
);
