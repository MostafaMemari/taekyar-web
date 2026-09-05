import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { FEATURES_INTRO, FEATURE_CARDS } from "@/data/home/features";
import { FeatureCard } from "./feature-cards";

export function Features() {
  return (
    <Section id="features" containerClassName="py-10 sm:py-12 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeader {...FEATURES_INTRO} />
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-foreground"
          >
            بیشتر درباره تک‌یار
            <ArrowLeft className="size-4" />
          </Link>
        </Reveal>

        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {FEATURE_CARDS.map((feature, index) => (
            <Reveal key={feature.title} delay={(index + 1) * 80}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
