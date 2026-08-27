import { SectionHeader } from "@/components/shared/section-header";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { ABOUT_VALUES } from "@/data/about";

export function AboutValues() {
  return (
    <div>
      <SectionHeader eyebrow="ارزش‌های ما" title="چه چیزی تک‌یار را می‌سازد" />
      <ul className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:mt-8 lg:grid-cols-4">
        {ABOUT_VALUES.map(({ id, title, description, Icon, chipClassName }) => (
          <li key={id} className={cn(SURFACE_CARD, "flex h-full flex-col p-5 sm:p-6")}>
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-xl ring-1",
                chipClassName,
              )}
            >
              <Icon className="!size-5" />
            </span>
            <h3 className="mt-4 text-[15px] font-extrabold sm:text-base">{title}</h3>
            <p className="mt-2 text-[13px] leading-7 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
