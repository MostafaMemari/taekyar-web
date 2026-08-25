import Link from "next/link";
import { ArrowLeft, MessagesSquare } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CONTACT_CARD, FAQS, FAQ_INTRO } from "./data";

function FaqList() {
  return (
    <div className="mt-2 max-w-3xl">
      <Accordion type="single" collapsible>
        {FAQS.map(({ question, answer }, index) => (
          <AccordionItem key={question} value={`faq-${index + 1}`}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function ContactBanner() {
  return (
    <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl bg-belt-black p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
        <MessagesSquare className="!size-6" />
      </span>

      <div className="flex-1">
        <h3 className="text-lg font-extrabold text-white">{CONTACT_CARD.title}</h3>
        <p className="mt-1.5 text-sm leading-7 text-white/60">
          {CONTACT_CARD.description}
        </p>
      </div>

      <Button
        asChild
        size="lg"
        className="h-11 w-full shrink-0 gap-2 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto"
      >
        <Link href={CONTACT_CARD.href}>
          {CONTACT_CARD.cta}
          <ArrowLeft className="!size-4" />
        </Link>
      </Button>
    </div>
  );
}

export function Faq() {
  return (
    <Section id="faq" divider>
      <Reveal>
        <SectionHeader {...FAQ_INTRO} />
      </Reveal>

      <Reveal delay={80}>
        <FaqList />
      </Reveal>

      <Reveal delay={120}>
        <ContactBanner />
      </Reveal>
    </Section>
  );
}
