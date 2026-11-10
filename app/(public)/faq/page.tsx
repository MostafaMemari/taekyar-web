import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";

import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { FaqJsonLd } from "@/components/faq/faq-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getHomepageFaqs } from "@/lib/site/faq";
import { FAQ_INTRO, CONTACT_CARD } from "@/data/home/faq";

export const metadata: Metadata = {
  title: FAQ_INTRO.title,
  description: FAQ_INTRO.description,
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getHomepageFaqs();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "سوالات متداول", path: "/faq" },
        ])}
      />
      <FaqJsonLd faqs={faqs} />
      <div className="bg-warm-dots">
        <Section spacing="none" containerClassName="pb-10 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
          <Reveal>
            <h1 className="text-center text-balance font-heading text-[2rem] leading-[1.4] text-[#c79500] sm:text-[2.75rem] sm:leading-[1.3] lg:text-[3.25rem] lg:leading-[1.25]">
              {FAQ_INTRO.title}
            </h1>
            <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
              <span className="size-1.5 rotate-45 bg-[#E0A800]" />
              <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-pretty text-[15px] leading-8 text-black/55">
              {FAQ_INTRO.description}
            </p>
          </Reveal>
        </Section>

        <Section spacing="none" containerClassName="pb-12 sm:pb-14">
          {faqs.length > 0 ? (
            <Accordion type="multiple" className="mx-auto grid max-w-3xl grid-cols-1 items-start gap-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="rounded-2xl border border-black/[0.07] bg-white px-5 text-start text-[14px] font-bold shadow-[0_10px_24px_-18px_rgba(15,23,42,0.25)] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-3 text-[13px] leading-7 text-black/55">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : null}

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#E0A800]/25 bg-gradient-to-bl from-[#FDF6E1] to-[#F9EDCB] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]">
                <MessageCircleQuestion className="size-5" />
              </span>
              <div>
                <h2 className="text-[15px] font-extrabold text-[#1b2330]">{CONTACT_CARD.title}</h2>
                <p className="mt-2 text-[13px] leading-7 text-black/55">{CONTACT_CARD.description}</p>
                <Link
                  href={CONTACT_CARD.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E0A800]/35 bg-white/80 px-4 py-2 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
                >
                  {CONTACT_CARD.cta}
                  <ArrowLeft className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
