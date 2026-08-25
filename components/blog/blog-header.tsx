import { BLOG_INDEX_INTRO } from "@/components/blog/data";
import { BeltDivider } from "@/components/shared/belt-divider";

export function BlogHeader() {
  return (
    <div className="max-w-2xl">
      <span className="text-sm font-bold text-primary">
        {BLOG_INDEX_INTRO.eyebrow}
      </span>
      <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">
        {BLOG_INDEX_INTRO.title}
      </h1>
      <BeltDivider fullWidth={false} variant="pill" className="mt-4 h-1 w-20" />
      <p className="mt-4 text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
        {BLOG_INDEX_INTRO.description}
      </p>
    </div>
  );
}
