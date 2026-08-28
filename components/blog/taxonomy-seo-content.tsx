import { TAG_PAGE_LABELS } from "@/data/blog/tag-page";
import { SURFACE_CARD } from "@/lib/styles";

interface TaxonomySeoContentProps {
  title: string;
  content: string;
  postsCount: number;
}

export function TaxonomySeoContent({ title, content, postsCount }: TaxonomySeoContentProps) {
  return (
    <section className={SURFACE_CARD} aria-labelledby="taxonomy-seo-heading">
      <div className="max-w-3xl p-4 sm:p-6 lg:p-10">
        <h2
          id="taxonomy-seo-heading"
          className="text-balance text-lg font-black tracking-tight sm:text-xl"
        >
          {TAG_PAGE_LABELS.seoHeading}: {title}
        </h2>
        <div className="mt-3.5 space-y-4 text-pretty text-[14px] leading-8 text-muted-foreground sm:text-[15px]">
          <p>
            {TAG_PAGE_LABELS.seoIntroPrefix} {postsCount} {TAG_PAGE_LABELS.seoIntroSuffix}
          </p>
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
}
