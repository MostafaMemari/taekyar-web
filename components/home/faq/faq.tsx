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
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { FAQS } from "./data";

export function Faq() {
  return (
    <Section id="faq" className="bg-[#f5f5f4]">
      <Reveal>
        <SectionHeader
          eyebrow="سوالات متداول"
          title="سوالی دارید؟ پاسخ اینجاست"
          description="چیزهایی که کاربران پیش از نصب تک‌یار از ما می‌پرسند؛ اگر پاسخت را پیدا نکردی، تیم ما یک پیام فاصله دارد."
        />
      </Reveal>

      <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <Reveal delay={80}>
          <div className={cn(SURFACE_CARD, "p-5 sm:p-7")}>
            <Accordion type="single" collapsible>
              {FAQS.map(({ question, answer }, index) => (
                <AccordionItem key={question} value={`faq-${index + 1}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className={cn(SURFACE_CARD, "p-6 text-center sm:p-7 lg:sticky lg:top-24")}>
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              <MessagesSquare className="!size-6" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold leading-8">
              سوال دیگری دارید؟ با ما تماس بگیرید
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              تیم پشتیبانی تک‌یار در سریع‌ترین زمان ممکن پاسخگوی شماست.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-5 h-11 w-full gap-2 rounded-xl bg-primary text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              <Link href="/contact">
                تماس با ما
                <ArrowLeft className="!size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
