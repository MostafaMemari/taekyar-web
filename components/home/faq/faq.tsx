import { FaqSection } from "@/components/faq/faq-section";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { ContactBanner } from "@/components/shared/contact-banner";
import { CONTACT_CARD, FAQ_INTRO } from "@/data/home/faq";
import { getHomepageFaqs } from "@/lib/faq";

export async function Faq() {
  const faqs = await getHomepageFaqs();

  if (faqs.length === 0) return null;

  return (
    <Section
      id="faq"
      tone="soft"
      containerClassName="py-10 sm:py-12 lg:py-14"
    >
      <Reveal>
        <FaqSection
          faqs={faqs}
          {...FAQ_INTRO}
          accordionClassName="max-w-5xl px-4 sm:px-6 md:grid-cols-2 md:gap-5 lg:gap-6 lg:px-0"
        />
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-10">
          <ContactBanner
            title={CONTACT_CARD.title}
            description={CONTACT_CARD.description}
            actionLabel={CONTACT_CARD.cta}
            actionHref={CONTACT_CARD.href}
          />
        </div>
      </Reveal>
    </Section>
  );
}
