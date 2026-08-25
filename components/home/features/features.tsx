import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { FeatureCard } from "./feature-card";
import { FEATURED_FEATURE, FEATURES, PLAN_CHIPS } from "./data";

function FeaturedFeatureCard() {
  const { Icon, tint, title, description } = FEATURED_FEATURE;

  return (
    <article className="h-full rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.07] sm:p-6 lg:flex lg:items-center lg:gap-7 lg:p-7">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full ${tint} ring-1 ring-primary/15`}
      >
        <Icon className="!size-6" />
      </span>
      <div className="mt-4 lg:mt-0">
        <h3 className="text-lg font-extrabold sm:text-xl">{title}</h3>
        <p className="mt-2 text-sm font-normal leading-8 text-muted-foreground">
          {description}
        </p>
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
  );
}

export function Features() {
  return (
    <section
      id="features"
      className="theme-light relative isolate scroll-mt-24 bg-[#f5f5f4] text-foreground"
    >
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_88%_-5%,rgba(224,40,46,0.05),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal>
          <SectionHeader
            eyebrow="چرا تک‌یار؟"
            title="تمرین هوشمند، پیشرفت واقعی"
            description="تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست. هرچه برای رشد در تکواندو لازم داری، اینجا کنار هم است."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          <Reveal className="sm:col-span-2">
            <FeaturedFeatureCard />
          </Reveal>

          {FEATURES.map(({ title, ...feature }, index) => (
            <Reveal key={title} delay={(index + 1) * 80}>
              <FeatureCard {...feature} title={title} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
