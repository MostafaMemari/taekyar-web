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
      <div className="p-5 sm:p-7 lg:p-8">
        {imageUrl ? (
          <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-muted/40 shadow-md shadow-black/[0.07] ring-1 ring-border/60">
            <Image
              src={r2PublicUrl(imageUrl)}
              alt={imageAlt || title}
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>
        ) : placeholderIcon ? (
          <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-border/60">
            <ImagePlaceholder
              icon={placeholderIcon}
              label={imageAlt || title}
              className="rounded-2xl"
              iconClassName="size-11"
            />
          </div>
        ) : null}

        <h2
          id="taxonomy-seo-heading"
          className={cn(
            "text-balance text-lg font-black tracking-tight sm:text-xl",
            hasMedia && "mt-5 text-center sm:mt-6"
          )}
        >
          {title}
        </h2>
        <p className="mt-3 max-w-4xl text-pretty text-start text-[14px] leading-8 text-muted-foreground sm:text-[15px] sm:leading-8">
          {content}
        </p>
      </div>
    </section>
  );
}
