import { BeltDivider } from "@/components/shared/belt-divider";
import { ABOUT_MOTTO, ABOUT_STORY } from "@/data/about";
import { SectionHeader } from "@/components/shared/section-header";
import { SURFACE_CARD } from "@/lib/styles";

export function AboutStory() {
  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:gap-10">
      <div className="lg:col-span-3">
        <SectionHeader eyebrow={ABOUT_STORY.eyebrow} title={ABOUT_STORY.title} />
        <div className="mt-5 space-y-4 text-[14px] leading-8 text-muted-foreground sm:mt-6 sm:text-[15px] sm:leading-9">
          {ABOUT_STORY.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <figure
        className={
          SURFACE_CARD +
          " flex h-full flex-col items-start gap-3 p-6 sm:p-7 lg:col-span-2"
        }
      >
        <BeltDivider fullWidth={false} variant="pill" className="h-1 w-14" />
        <blockquote className="text-balance pt-1 text-lg font-extrabold leading-9 sm:text-xl sm:leading-10">
          «{ABOUT_MOTTO.quote}»
        </blockquote>
        <figcaption className="mt-auto pt-3 text-xs font-medium text-muted-foreground sm:text-[13px]">
          {ABOUT_MOTTO.author}
        </figcaption>
      </figure>
    </div>
  );
}
