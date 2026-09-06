import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Folder } from "lucide-react";

import { TaxonomyArchive, type TaxonomyRelatedLink } from "@/components/blog/taxonomy-archive";
import { JsonLd } from "@/components/shared/json-ld";
import { BLOG_PAGINATION } from "@/data/blog/index-page";
import { CATEGORY_PAGE_LABELS } from "@/data/blog/category-page";
import { archiveJsonLd, breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getPaginatedPostsByCategory, resolveCategoryPath, getCategoryTree } from "@/lib/blog";
import type { PublicCategoryNode } from "@/lib/blog/categories";
import { buildPageMetadata } from "@/lib/seo";
import { resolveSeo } from "@/lib/seo-resolve";
import { htmlToPlainText } from "@/lib/post-content";
import { categoryHref } from "@/lib/routes";
import { toFaDigits } from "@/lib/utils";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<{ page?: string }>;
}

function decodeSegments(segments: string[]): string[] {
  return segments.map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  });
}

function resolvePage(value?: string): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function pageHref(basePath: string, page: number): string {
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}

function collectRelated(
  nodes: PublicCategoryNode[],
  path: string,
): { node: PublicCategoryNode; siblings: PublicCategoryNode[] } | null {
  for (const node of nodes) {
    if (node.path === path) return { node, siblings: nodes };
    const found = collectRelated(node.children, path);
    if (found) return found;
  }
  return null;
}

function buildRelatedLinks(
  tree: PublicCategoryNode[],
  path: string,
): { label: string; links: TaxonomyRelatedLink[] } | null {
  const found = collectRelated(tree, path);
  if (!found) return null;

  if (found.node.children.length > 0) {
    return {
      label: CATEGORY_PAGE_LABELS.childrenLabel,
      links: found.node.children.map((child) => ({
        name: child.name,
        path: categoryHref(child.path),
        count: child.postCount,
      })),
    };
  }

  const siblings = found.siblings.filter((sibling) => sibling.path !== path);
  if (siblings.length === 0) return null;

  return {
    label: CATEGORY_PAGE_LABELS.siblingsLabel,
    links: siblings.map((sibling) => ({
      name: sibling.name,
      path: categoryHref(sibling.path),
      count: sibling.postCount,
    })),
  };
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const [{ path }, { page }] = await Promise.all([params, searchParams]);
  const resolved = await resolveCategoryPath(decodeSegments(path));

  if (resolved.status !== "found") return { title: "دسته‌بندی یافت نشد" };
  const { category } = resolved;
  const requestedPage = resolvePage(page);
  const basePath = categoryHref(category.path);
  const { totalCount } = await getPaginatedPostsByCategory(
    { id: category.id, path: category.path },
    { page: requestedPage, perPage: BLOG_PAGINATION.postsPerPage },
  );
  const totalPages = Math.max(1, Math.ceil(totalCount / BLOG_PAGINATION.postsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);

  const plainDescription = category.description ? htmlToPlainText(category.description) : null;

  const seo = resolveSeo(category.seo, {
    title: currentPage > 1 ? `${category.name} · صفحه ${toFaDigits(currentPage)}` : category.name,
    description: plainDescription,
    defaultDescription: `مقالات دسته‌بندی «${category.name}» در وبلاگ تک‌یار.`,
    canonicalPath: basePath,
  });

  const paginatedPath = pageHref(basePath, currentPage);

  return buildPageMetadata({
    ...seo,
    ...(currentPage > 1 && !category.seo?.canonical?.trim()
      ? { canonical: paginatedPath }
      : {}),
    path: paginatedPath,
    imageUrl: category.image,
    imageAlt: category.imageAlt ?? category.name,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ path }, { page }] = await Promise.all([params, searchParams]);
  const resolved = await resolveCategoryPath(decodeSegments(path));

  if (resolved.status === "missing") notFound();
  if (resolved.status === "redirect") permanentRedirect(categoryHref(resolved.category.path));

  const { category, ancestors } = resolved;
  const basePath = categoryHref(category.path);
  const requestedPage = resolvePage(page);
  const firstFetch = await getPaginatedPostsByCategory(
    { id: category.id, path: category.path },
    { page: requestedPage, perPage: BLOG_PAGINATION.postsPerPage },
  );
  const totalPages = Math.max(1, Math.ceil(firstFetch.totalCount / BLOG_PAGINATION.postsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);
  const { posts: visiblePosts } =
    currentPage === requestedPage
      ? firstFetch
      : await getPaginatedPostsByCategory(
          { id: category.id, path: category.path },
          { page: currentPage, perPage: BLOG_PAGINATION.postsPerPage },
        );
  const totalCount = firstFetch.totalCount;
  const breadcrumbs = [
    { name: "وبلاگ", path: "/blog" },
    ...ancestors.map((ancestor) => ({ name: ancestor.name, path: categoryHref(ancestor.path) })),
    { name: category.name, path: basePath },
  ];
  const related = buildRelatedLinks(await getCategoryTree(), category.path);
  const plainDescription = category.description ? htmlToPlainText(category.description) : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd
        data={archiveJsonLd({
          name: category.name,
          path: pageHref(basePath, currentPage),
          description: plainDescription,
          imageUrl: category.image,
          posts: visiblePosts,
          totalCount,
        })}
      />
      <TaxonomyArchive
        eyebrow={CATEGORY_PAGE_LABELS.eyebrow}
        title={category.name}
        description={category.description}
        imageUrl={category.image}
        imageAlt={category.imageAlt}
        placeholderIcon={Folder}
        posts={visiblePosts}
        totalCount={totalCount}
        breadcrumbs={breadcrumbs}
        pagination={{
          currentPage,
          totalPages,
          hrefFor: (targetPage) => pageHref(basePath, targetPage),
        }}
        relatedLabel={related?.label}
        relatedLinks={related?.links}
      />
    </>
  );
}
