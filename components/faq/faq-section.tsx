import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/shared/json-ld";
import { SectionHeader } from "@/components/shared/section-header";
import { faqJsonLd, type PublicFaq } from "@/lib/faq";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  faqs: Pick<PublicFaq, "question" | "answer">[];
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  className?: string;
  accordionClassName?: string;
}

export function FaqJsonLd({ faqs }: { faqs: Pick<PublicFaq, "question" | "answer">[] }) {
  if (faqs.length === 0) return null;
  return <JsonLd data={faqJsonLd(faqs.map((faq, index) => ({ id: index, ...faq })))} />;
}

export function FaqSection({ faqs, eyebrow, title, description, id, className, accordionClassName }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <div id={id} className={cn("scroll-mt-24", className)}>
      <FaqJsonLd faqs={faqs} />
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <Accordion
        type="multiple"
        className={cn(
          "mx-auto mt-8 grid max-w-3xl grid-cols-1 items-start gap-4 lg:mt-10",
          accordionClassName,
        )}
      >
        {faqs.map(({ question, answer }, index) => (
          <AccordionItem key={`${question}-${index}`} value={`faq-${index + 1}`} className="px-5 py-1 sm:px-6">
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
