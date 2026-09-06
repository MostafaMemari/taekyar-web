import Image from "next/image";
import type { LucideIcon } from "lucide-react";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { r2PublicUrl } from "@/lib/r2-url";

interface TaxonomySeoContentProps {
  title: string;
  content: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  placeholderIcon?: LucideIcon;
}

export function TaxonomySeoContent({ title, content, imageUrl, imageAlt, placeholderIcon }: TaxonomySeoContentProps) {
  const hasMedia = Boolean(imageUrl || placeholderIcon);

  return (
    <section className={SURFACE_CARD} aria-labelledby="taxonomy-seo-heading">
      <div
        className={cn(
          "mx-auto max-w-4xl p-5 sm:p-7 lg:p-8",
          hasMedia && "text-center"
        )}
      >
        {imageUrl ? (
          <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-muted/40 shadow-md shadow-black/[0.07] ring-1 ring-border/60 sm:max-w-[220px]">
            <Image
              src={r2PublicUrl(imageUrl)}
              alt={imageAlt || title}
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>
        ) : placeholderIcon ? (
          <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-border/60 sm:max-w-[220px]">
            <ImagePlaceholder
              icon={placeholderIcon}
              label={imageAlt || title}
              className="rounded-2xl"
              iconClassName="size-12"
            />
          </div>
        ) : null}

        <h2
          id="taxonomy-seo-heading"
          className={cn(
            "text-balance text-lg font-black tracking-tight sm:text-xl",
            hasMedia && "mt-5 sm:mt-6"
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-3 text-pretty text-[14px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8",
            hasMedia ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {content}
        </p>
      </div>
    </section>
  );
}
