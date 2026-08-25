import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContactBanner } from "./contact-banner";
import { FAQS } from "./data";

function FaqList() {
  return (
    <div className="mt-10 max-w-3xl rounded-3xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:p-7 lg:mt-12">
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

export function Faq() {
  return (
    <section
      id="faq"
      className="theme-light relative isolate scroll-mt-24 bg-background text-foreground"
    >
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal>
          <SectionHeader
            eyebrow="سوالات متداول"
            title="سوالی دارید؟ پاسخ اینجاست"
            description="چیزهایی که کاربران پیش از نصب تک‌یار از ما می‌پرسند؛ اگر پاسخت را پیدا نکردی، تیم ما یک پیام فاصله دارد."
          />
        </Reveal>

        <Reveal delay={100}>
          <FaqList />
        </Reveal>

        <Reveal delay={140}>
          <ContactBanner />
        </Reveal>
      </div>
    </section>
  );
}
