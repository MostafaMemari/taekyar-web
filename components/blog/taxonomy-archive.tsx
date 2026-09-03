import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";

import { PostGrid } from "@/components/blog/post-grid";
import { BlogPagination } from "@/components/blog/pagination";
import { TaxonomySeoContent } from "@/components/blog/taxonomy-seo-content";
import { BeltDivider } from "@/components/shared/belt-divider";
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
}: TaxonomyArchiveProps) {
  return (
    <>
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
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

          <div className="mt-4 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary sm:text-xs">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {eyebrow}
            </span>
            <h1 className="mt-2.5 text-balance text-[1.65rem] font-black leading-[1.35] tracking-tight sm:mt-3 sm:text-[2rem] sm:leading-[1.35] lg:text-[2.35rem]">
              {title}
            </h1>
            <BeltDivider variant="pill" className="mt-3.5 h-1 w-16 sm:w-20" />
            <p className="mt-3.5 text-xs font-medium text-muted-foreground sm:text-[13px]">
              <span className="font-bold tabular-nums text-foreground">{toFaDigits(totalCount)}</span> {BLOG_INDEX_LABELS.resultsSuffix}
              {pagination && pagination.totalPages > 1 ? (
                <>
                  {" · "}
                  صفحه {toFaDigits(pagination.currentPage)} از {toFaDigits(pagination.totalPages)}
                </>
              ) : null}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-6 pb-2 sm:pt-7 lg:pt-8">
        <PostGrid posts={posts} />
      </Section>

      {pagination && pagination.totalPages > 1 ? (
        <Section containerClassName="pb-2 pt-8 sm:pt-10">
          <BlogPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hrefFor={pagination.hrefFor}
          />
        </Section>
      ) : null}

      {description ? (
        <Section containerClassName="pt-8 pb-2 sm:pt-10">
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
