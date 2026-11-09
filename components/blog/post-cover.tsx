import Image from "next/image";
import { Newspaper } from "lucide-react";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import type { BlogPost } from "@/lib/blog";
import { r2PublicUrl } from "@/lib/r2-url";

export function PostCover({ post }: { post: BlogPost }) {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="relative rounded-[22px] border border-black/[0.05] bg-white p-2.5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)] sm:p-3">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          {post.coverImage ? (
            <Image
              src={r2PublicUrl(post.coverImage)}
              alt={post.coverImageAlt || post.title}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 960px"
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
        </div>
      </div>
    </div>
  );
}
