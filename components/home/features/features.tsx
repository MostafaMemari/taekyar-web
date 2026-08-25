import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { BeltPath } from "./belt-path";
import { FEATURES_INTRO, SUPPORTING_FEATURES } from "./data";
import { FeatureCard, FeaturedFeatureCard } from "./feature-cards";

export function Features() {
  return (
    <Section id="features" divider>
      <Reveal>
        <SectionHeader {...FEATURES_INTRO} />
      </Reveal>

      <div className="mt-8 space-y-4 lg:mt-10 lg:space-y-5">
        <Reveal>
          <FeaturedFeatureCard />
        </Reveal>

        <Reveal delay={80}>
          <BeltPath />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {SUPPORTING_FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={(index + 1) * 80}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
