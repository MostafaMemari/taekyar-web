import Image from "next/image";

import { r2PublicUrl } from "@/lib/r2-url";

interface ImageBlockProps {
  src: string;
  alt: string;
  caption: string | null;
}

export function ImageBlock({ src, alt, caption }: ImageBlockProps) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-muted ring-1 ring-black/[0.06]">
      <Image
        src={r2PublicUrl(src)}
        alt={alt}
        width={1200}
        height={675}
        sizes="(max-width: 768px) 100vw, 768px"
        className="h-auto w-full object-cover"
      />
      {caption ? (
        <figcaption className="px-4 py-2.5 text-center text-xs leading-6 text-muted-foreground sm:text-[13px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
