import { CATEGORY_STYLES } from "@/components/blog/data";
import { BeltDivider } from "@/components/shared/belt-divider";
import type { BlogPost } from "@/lib/blog";

export function PostCover({ category }: { category: BlogPost["category"] }) {
  const { color, Icon } = CATEGORY_STYLES[category];

  return (
    <div
      className="relative mt-8 h-52 w-full overflow-hidden rounded-2xl shadow-lg shadow-black/[0.08] ring-1 ring-black/[0.06] sm:h-72 lg:mt-10 lg:h-[22rem]"
      style={{ backgroundColor: color }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.09)_0_2px,transparent_2px_16px)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_60%)]"
      />
      <Icon
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-white/25 sm:size-36"
        strokeWidth={1.1}
      />
      <BeltDivider
        fullWidth
        className="absolute inset-x-0 bottom-0 h-[4px] border-0 opacity-90"
      />
    </div>
  );
}
