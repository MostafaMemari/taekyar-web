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
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
        <Reveal>
          <AboutHeader />
        </Reveal>
      </Section>

      <Section divider containerClassName="pt-6 pb-10 sm:pt-7 sm:pb-12 lg:pb-14">
        <Reveal delay={80}>
          <AboutStats />
        </Reveal>
      </Section>

      <Section containerClassName="pt-2 pb-10 sm:pb-12 lg:pb-16">
        <Reveal delay={120}>
          <AboutStory />
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 sm:mt-14 lg:mt-16">
            <AboutValues />
          </div>
        </Reveal>
      </Section>

      <Section containerClassName="pb-12 sm:pb-16">
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
