import Image from "next/image";
import Link from "next/link";

import { PostGrid } from "@/components/blog/post-grid";
import { TaxonomySeoContent } from "@/components/blog/taxonomy-seo-content";
import { BeltDivider } from "@/components/shared/belt-divider";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import type { BlogPost } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";

export interface TaxonomyBreadcrumb {
  name: string;
  path: string;
}

interface TaxonomyArchiveProps {
  eyebrow: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  posts: BlogPost[];
  seoContent?: string | null;
  breadcrumbs: TaxonomyBreadcrumb[];
}

export function TaxonomyArchive({
  eyebrow,
  title,
  description,
  imageUrl,
  posts,
  seoContent,
  breadcrumbs,
}: TaxonomyArchiveProps) {
  return (
    <>
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
        <Reveal>
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1;

              return (
                <span key={crumb.path} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-muted-foreground/40">/</span>
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
            <BeltDivider variant="pill" width="contained" className="mt-3.5 h-1 w-16 sm:w-20" />

            {imageUrl ? (
              <div className="relative mx-auto mt-6 aspect-[16/7] w-full max-w-xs overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-black/[0.06] sm:max-w-sm">
                <Image
                  src={r2PublicUrl(imageUrl)}
                  alt={title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : null}

            {description ? (
              <p className="mt-6 text-pretty text-[14px] leading-7 text-muted-foreground sm:text-[15px] sm:leading-7">
                {description}
              </p>
            ) : null}
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pt-6 pb-2 sm:pt-7 lg:pt-8">
        <PostGrid posts={posts} />
      </Section>

      {seoContent ? (
        <Section containerClassName="pt-8 pb-2 sm:pt-10">
          <TaxonomySeoContent title={title} content={seoContent} postsCount={posts.length} />
        </Section>
      ) : null}
    </>
  );
}
