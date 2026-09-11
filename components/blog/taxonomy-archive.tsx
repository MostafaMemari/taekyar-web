import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";

import { PostGrid } from "@/components/blog/post-grid";
import { BlogPagination } from "@/components/blog/pagination";
import { PaginationScrollTop } from "@/components/blog/pagination-scroll-top";
import { TaxonomySeoContent } from "@/components/blog/taxonomy-seo-content";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import type { BlogPost } from "@/lib/blog";
import { toFaDigits } from "@/lib/utils";

export interface TaxonomyBreadcrumb {
  name: string;
  path: string;
}

export interface TaxonomyPagination {
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

export interface TaxonomyRelatedLink {
  name: string;
  path: string;
  count: number;
}

interface TaxonomyArchiveProps {
  eyebrow: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  placeholderIcon?: LucideIcon;
  posts: BlogPost[];
  totalCount: number;
  breadcrumbs: TaxonomyBreadcrumb[];
  pagination?: TaxonomyPagination;
  relatedLabel?: string;
  relatedLinks?: TaxonomyRelatedLink[];
}

export function TaxonomyArchive({
  eyebrow,
  title,
  description,
  imageUrl,
  imageAlt,
  placeholderIcon,
  posts,
  totalCount,
  breadcrumbs,
  pagination,
  relatedLabel,
  relatedLinks,
}: TaxonomyArchiveProps) {
  return (
    <>
      <Section spacing="none" containerClassName="pb-4 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
        <PaginationScrollTop targetId="archive-top" />
        <Reveal>
          <nav aria-label="مسیر" className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1;

              return (
                <span key={crumb.path} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronLeft aria-hidden="true" className="size-3.5 text-muted-foreground/40" />
                  ) : null}
                  {last ? (
                    <span aria-current="page" className="font-bold text-foreground">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          <div className="mt-4">
            <PageHeader eyebrow={eyebrow} title={title} />
            <p className="mt-3 text-xs font-medium text-muted-foreground sm:text-[13px]">
              <span className="font-bold tabular-nums text-foreground">{toFaDigits(totalCount)}</span> {BLOG_INDEX_LABELS.resultsSuffix}
              {pagination && pagination.totalPages > 1 ? (
                <>
                  {" · "}
                  صفحه {toFaDigits(pagination.currentPage)} از {toFaDigits(pagination.totalPages)}
                </>
              ) : null}
            </p>

            {relatedLinks && relatedLinks.length > 0 && relatedLabel ? (
              <div className="mt-5">
                <p className="text-[11px] font-bold text-muted-foreground">{relatedLabel}</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {relatedLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {link.name}
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                          {toFaDigits(link.count)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Reveal>
      </Section>

      <Section spacing="none" containerClassName="pt-8 sm:pt-10">
        <PostGrid posts={posts} />
      </Section>

      {pagination && pagination.totalPages > 1 ? (
        <Section spacing="compact">
          <BlogPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hrefFor={pagination.hrefFor}
          />
        </Section>
      ) : null}

      {description ? (
        <Section spacing="compact">
          <TaxonomySeoContent
            title={title}
            content={description}
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            placeholderIcon={placeholderIcon}
          />
        </Section>
      ) : null}
    </>
  );
}
