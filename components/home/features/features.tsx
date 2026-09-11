import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { PhoneMockup } from "@/components/home/app-preview/phone-mockup";
import { FEATURE_MAIN, FEATURES_INTRO, SUPPORTING_FEATURES } from "@/data/home/features";
import { FeatureSupportItem } from "./feature-cards";

export function Features() {
  const { Icon, title, description } = FEATURE_MAIN;

  return (
    <Section id="features" tone="default">
      <Reveal>
        <SectionHeader {...FEATURES_INTRO} className="max-w-xl" />
      </Reveal>

      <div className="mt-10 grid items-center gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-8">
        <Reveal className="order-2 lg:order-1">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Icon className="!size-[22px]" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold leading-8 sm:text-2xl sm:leading-9">
                {title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
            </div>
          </div>

          <ul className="mt-8 divide-y divide-border/60 border-t border-border/60">
            {SUPPORTING_FEATURES.map((feature) => (
              <FeatureSupportItem key={feature.title} {...feature} />
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <PhoneMockup />
        </Reveal>
      </div>
    </Section>
  );
}
