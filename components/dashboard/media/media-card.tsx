"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import type { MediaItem } from "@/lib/media";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

export function MediaCard({ item, isSelected, onSelect }: MediaCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.key)}
      aria-pressed={isSelected}
      className={cn(
        "block w-full overflow-hidden rounded-xl border bg-card text-start shadow-sm shadow-black/[0.03] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
        isSelected
          ? "border-primary/60 ring-2 ring-primary/25"
          : "border-border/60 hover:border-primary/30 hover:shadow-md hover:shadow-black/[0.06]",
      )}
    >
      <span className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={item.url}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 240px"
          className="object-cover"
          unoptimized
        />
        {isSelected ? (
          <span className="absolute end-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-card">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </span>

      <span className="block border-t border-border/60 p-2.5">
        <span dir="ltr" className="block truncate text-start text-[12px] font-bold leading-5 text-foreground">
          {item.name}
        </span>
        <span className="mt-0.5 block truncate text-[11px] leading-4 text-muted-foreground">
          {item.sizeLabel} · {item.uploadedAtLabel}
        </span>
      </span>
    </button>
  );
}
