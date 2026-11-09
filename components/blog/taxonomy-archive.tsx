import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";

import { PostGrid } from "@/components/blog/post-grid";
import { BlogPagination } from "@/components/blog/pagination";
import { PaginationScrollTop } from "@/components/blog/pagination-scroll-top";
import { TaxonomySeoContent } from "@/components/blog/taxonomy-seo-content";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import type { BlogPost } from "@/lib/blog";

export interface TaxonomyBreadcrumb {
  name: string;
  path: string;
}

export interface TaxonomyPagination {
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

export interface TaxonomyChip {
  name: string;
  path: string;
}

interface TaxonomyArchiveProps {
  title: string;
  titlePrefix?: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  placeholderIcon?: LucideIcon;
  posts: BlogPost[];
  breadcrumbs: TaxonomyBreadcrumb[];
  pagination?: TaxonomyPagination;
  chips?: TaxonomyChip[];
  chipActivePath?: string;
  allChip?: { name: string; path: string };
}

const CHIP_IDLE =
  "inline-flex items-center rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-bold text-[#1b2330] shadow-[0_2px_10px_-6px_rgba(15,23,42,0.25)] transition-all duration-200 hover:border-[#E0A800]/50 hover:text-[#8a6a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
const CHIP_ACTIVE =
  "inline-flex items-center rounded-full border border-transparent bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-4 py-2 text-[13px] font-extrabold text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function TaxonomyArchive({
  title,
  titlePrefix,
  description,
  imageUrl,
  imageAlt,
  placeholderIcon,
  posts,
  breadcrumbs,
  pagination,
  chips,
  chipActivePath,
  allChip,
}: TaxonomyArchiveProps) {
  const heading = titlePrefix ? `${titlePrefix} ${title}` : title;

  return (
    <div className="bg-warm-dots">
      <Section spacing="none" containerClassName="pb-10 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
        <PaginationScrollTop targetId="archive-top" />
        <Reveal>
          <nav
            aria-label="مسیر"
            className="flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium text-black/45"
          >
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1;

              return (
                <span key={crumb.path} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronLeft aria-hidden="true" className="size-3.5 text-black/25" />
                  ) : null}
                  {last ? (
                    <span aria-current="page" className="font-bold text-[#1b2330]">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="rounded-sm transition-colors hover:text-[#a37800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          <h1 className="mt-4 text-center text-balance font-heading text-[2rem] leading-[1.4] text-[#c79500] sm:text-[2.75rem] sm:leading-[1.3] lg:text-[3.25rem] lg:leading-[1.25]">
            {heading}
          </h1>

          <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
            <span className="size-1.5 rotate-45 bg-[#E0A800]" />
            <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
          </div>

          {allChip || (chips && chips.length > 0) ? (
            <ul className="mt-7 flex flex-wrap justify-center gap-2.5" role="navigation" aria-label={heading}>
              {allChip ? (
                <li>
                  <Link href={allChip.path} className={CHIP_IDLE}>
                    {allChip.name}
                  </Link>
                </li>
              ) : null}
              {chips?.map((chip) => {
                const active = chip.path === chipActivePath;

                return (
                  <li key={chip.path}>
                    <Link
                      href={chip.path}
                      aria-current={active ? "page" : undefined}
                      className={active ? CHIP_ACTIVE : CHIP_IDLE}
                    >
                      {chip.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </Reveal>
      </Section>

      <Section spacing="none" containerClassName="pb-12 sm:pb-14">
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
    </div>
  );
}
