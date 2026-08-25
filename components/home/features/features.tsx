import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { FEATURED_FEATURE, FEATURES, PLAN_CHIPS } from "./data";

export function Features() {
  const { Icon: FeaturedIcon, tint: featuredTint, title, description } = FEATURED_FEATURE;

  return (
    <Section id="features" className="bg-[#f5f5f4]">
      <Reveal>
        <SectionHeader
          eyebrow="چرا تک‌یار؟"
          title="تمرین هوشمند، پیشرفت واقعی"
          description="تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست. هرچه برای رشد در تکواندو لازم داری، اینجا کنار هم است."
        />
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
        <Reveal className="sm:col-span-2">
          <article
            className={cn(
              SURFACE_CARD,
              SURFACE_CARD_INTERACTIVE,
              "h-full p-5 sm:p-6 lg:flex lg:items-center lg:gap-7 lg:p-7"
            )}
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-full ring-1 ring-primary/15",
                featuredTint
              )}
            >
              <FeaturedIcon className="!size-6" />
            </span>
            <div className="mt-4 lg:mt-0">
              <h3 className="text-lg font-extrabold sm:text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-8 text-muted-foreground">{description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {PLAN_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>

        {FEATURES.map(({ Icon, tint, title: cardTitle, description: cardDescription }, index) => (
          <Reveal key={cardTitle} delay={(index + 1) * 80}>
            <article
              className={cn(SURFACE_CARD, SURFACE_CARD_INTERACTIVE, "h-full p-5 sm:p-6")}
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-full",
                  tint
                )}
              >
                <Icon className="!size-5" />
              </span>
              <h3 className="mt-3.5 text-base font-bold">{cardTitle}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {cardDescription}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
