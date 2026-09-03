import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { ContactBanner } from "@/components/shared/contact-banner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTACT_CARD, FAQS, FAQ_INTRO } from "@/data/home/faq";

function FaqList() {
  return (
    <Accordion
      type="multiple"
      className="mx-auto mt-8 grid max-w-3xl grid-cols-1 items-start gap-4 lg:mt-10"
    >
      {FAQS.map(({ question, answer }, index) => (
        <AccordionItem
          key={question}
          value={`faq-${index + 1}`}
          className="px-5 py-1 sm:px-6"
        >
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function Faq() {
  return (
    <Section id="faq" divider="top">
      <Reveal>
        <SectionHeader {...FAQ_INTRO} />
      </Reveal>

      <Reveal delay={80}>
        <FaqList />
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
