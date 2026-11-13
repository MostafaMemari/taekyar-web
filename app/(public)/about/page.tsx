import type { Metadata } from "next";

import { AboutHeader } from "@/components/about/about-header";
import { AboutStats } from "@/components/about/about-stats";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { ContactBanner } from "@/components/shared/contact-banner";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { ABOUT_CTA } from "@/data/about";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "آشنایی با تک‌یار؛ همراه تمرینی تکواندوکاران. قصه، ارزش‌ها و اهدافی که تمرین هدفمند و پیشرفت واقعی را برایت ساده‌تر می‌کنند.",
};

export default function AboutPage() {
  return (
    <>
      <Section spacing="none" containerClassName="pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pt-12">
        <Reveal>
          <AboutHeader />
        </Reveal>

        <Reveal delay={80} className="mt-10 sm:mt-12">
          <AboutStats />
        </Reveal>
      </Section>

      <Section>
        <Reveal delay={120}>
          <AboutStory />
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-12 sm:mt-16">
            <AboutValues />
          </div>
        </Reveal>
      </Section>

      <Section spacing="none" containerClassName="pb-14 sm:pb-20">
        <Reveal delay={200}>
          <ContactBanner
            title={ABOUT_CTA.title}
            description={ABOUT_CTA.description}
            actionLabel={ABOUT_CTA.actionLabel}
            actionHref={ABOUT_CTA.actionHref}
          />
        </Reveal>
      </Section>
    </>
  );
}
