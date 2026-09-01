import Image from "next/image";
import { Newspaper } from "lucide-react";

import { getCategoryStyle } from "@/data/blog/index-page";
import { BeltDivider } from "@/components/shared/belt-divider";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { BlogPost } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";

export function PostCover({ post }: { post: BlogPost }) {
  const { color } = getCategoryStyle(post.category);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-5 top-5 -bottom-3 hidden rounded-3xl opacity-15 lg:block"
        style={{ backgroundColor: color }}
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-md shadow-black/[0.07] ring-1 ring-black/[0.06]">
        {post.coverImage ? (
          <Image
            src={r2PublicUrl(post.coverImage)}
            alt={post.coverImageAlt || post.title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            icon={Newspaper}
            label={post.title}
            className="rounded-2xl"
            iconClassName="size-20 sm:size-28 lg:size-32"
          />
        )}
        <BeltDivider width="full" className="absolute inset-x-0 bottom-0 h-[4px] border-0 opacity-90" />
      </div>
    </div>
  );
}
