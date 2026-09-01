import Image from "next/image";

import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { SURFACE_CARD } from "@/lib/styles";
import { r2PublicUrl } from "@/lib/r2-url";

interface TaxonomySeoContentProps {
  title: string;
  content: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

export function TaxonomySeoContent({ title, content, imageUrl, imageAlt }: TaxonomySeoContentProps) {
  return (
    <section className={SURFACE_CARD} aria-labelledby="taxonomy-seo-heading">
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-10">
        {imageUrl ? (
          <div className="relative mx-auto aspect-[16/7] w-full max-w-xs overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-black/[0.06] sm:max-w-sm">
            <Image
              src={r2PublicUrl(imageUrl)}
              alt={imageAlt || title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : null}

        <h2
          id="taxonomy-seo-heading"
          className={imageUrl ? "mt-6 text-center text-balance text-lg font-black tracking-tight sm:mt-7 sm:text-xl" : "text-balance text-lg font-black tracking-tight sm:text-xl"}
        >
          {TAG_PAGE_LABELS.seoHeading}: {title}
        </h2>
        <p className="mt-3.5 text-pretty text-[14px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8">
          {content}
        </p>
      </div>
    </section>
  );
}
