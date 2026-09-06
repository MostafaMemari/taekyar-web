import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { FEATURES_INTRO, SUPPORTING_FEATURES } from "@/data/home/features";
import { FeatureSupportItem } from "./feature-cards";
import { FeatureSpotlight } from "./feature-spotlight";

export function Features() {
  return (
    <Section id="features" tone="default" containerClassName="py-10 sm:py-12 lg:py-14">
      <Reveal>
        <SectionHeader {...FEATURES_INTRO} className="max-w-xl" />
      </Reveal>

      <div className="mt-8 grid items-center gap-5 lg:mt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <Reveal>
          <FeatureSpotlight />
        </Reveal>

        <Reveal delay={120}>
          <ul className="divide-y divide-border/50">
            {SUPPORTING_FEATURES.map((feature) => (
              <FeatureSupportItem key={feature.title} {...feature} />
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
