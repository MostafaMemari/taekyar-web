import { FaqSection } from "@/components/faq/faq-section";
import { Section } from "@/components/shared/section";
import { FAQ_INTRO } from "@/data/home/faq";
import { getHomepageFaqs } from "@/lib/faq";

export async function Faq() {
  const faqs = await getHomepageFaqs();

  if (faqs.length === 0) return null;

  return (
    <Section id="faq" tone="soft">
      
        <FaqSection
          faqs={faqs}
          {...FAQ_INTRO}
          accordionClassName="max-w-5xl px-4 sm:px-6 md:grid-cols-2 md:gap-5 lg:gap-6 lg:px-0"
        />
      
    </Section>
  );
}
