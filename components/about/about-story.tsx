import { ABOUT_STORY } from "@/data/about";
import { MottoCard } from "@/components/about/motto-card";
import { SectionHeader } from "@/components/shared/section-header";

export function AboutStory() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-10">
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

      <div className="lg:col-span-2">
        <MottoCard />
      </div>
    </div>
  );
}
