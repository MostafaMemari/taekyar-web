import Image from "next/image";

import { getCategoryStyle } from "@/data/blog/index-page";
import { BeltDivider } from "@/components/shared/belt-divider";
import type { BlogPost } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";

export function PostCover({ post }: { post: BlogPost }) {
  const { color, Icon } = getCategoryStyle(post.category);

  if (post.coverImage) {
    return (
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-5 top-5 -bottom-3 hidden rounded-3xl opacity-15 lg:block"
          style={{ backgroundColor: color }}
        />

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-black/[0.06]">
          <Image
            src={r2PublicUrl(post.coverImage)}
            alt={post.coverImageAlt || post.title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
          <BeltDivider width="full" className="absolute inset-x-0 bottom-0 h-[4px] border-0 opacity-90" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-5 top-5 -bottom-3 hidden rounded-3xl opacity-15 lg:block"
        style={{ backgroundColor: color }}
      />

      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-black/[0.06]"
        style={{ backgroundColor: color }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
        <Icon
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-white/25 sm:size-36"
          strokeWidth={1.1}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-xl ring-1 ring-white/20" />
        <BeltDivider width="full" className="absolute inset-x-0 bottom-0 h-[4px] border-0 opacity-90" />
      </div>
    </div>
  );
}
