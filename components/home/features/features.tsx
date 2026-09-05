import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { FEATURES_INTRO, FEATURE_CARDS } from "@/data/home/features";
import { FeatureCard } from "./feature-cards";

export function Features() {
  return (
    <Section id="features" containerClassName="py-10 sm:py-12 lg:py-14">
      <Reveal>
        <SectionHeader {...FEATURES_INTRO} />
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
        {FEATURE_CARDS.map((feature, index) => (
          <Reveal key={feature.title} delay={(index + 1) * 80} className="h-full">
            <FeatureCard {...feature} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
