import Link from "next/link";
import { ArrowLeft, MessagesSquare } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    question: "تک‌یار برای چه کسانی مناسب است؟",
    answer:
      "برای هر علاقه‌مندی به تکواندو؛ از مبتدی‌ای که اولین ضربه‌اش را یاد می‌گیرد تا ورزشکاری که خودش را برای آزمون کمربند یا مسابقه آماده می‌کند.",
  },
  {
    question: "برنامه تمرینی چطور شخصی‌سازی می‌شود؟",
    answer:
      "کافی است سطح، هدفت و روزهای تمرینت را مشخص کنی؛ تک‌یار بر همان اساس برنامه هفتگی می‌سازد و با پیشرفت تو آن را به‌روز نگه می‌دارد.",
  },
  {
    question: "آیا می‌توانم مسیر ارتقای کمربندم را دنبال کنم؟",
    answer:
      "بله؛ از کمربند سفید تا سیاه، فن‌ها و شرایط هر آزمون ثبت شده است. همیشه می‌بینی دقیقاً کجای مسیر ایستاده‌ای و برای قدم بعدی چه چیزی لازم داری.",
  },
  {
    question: "امکان پرسیدن سوال از مربی وجود دارد؟",
    answer:
      "بله؛ سوالاتت را از مربی بپرس، ویدیوی اجرایت را برایش بفرست و روی فن‌هایت بازخورد مستقیم بگیر تا با اطمینان جلو بروی.",
  },
  {
    question: "آیا استفاده از تک‌یار رایگان است؟",
    answer:
      "دانلود و شروع استفاده از تک‌یار رایگان است؛ امکانات تکمیلی داخل اپلیکیشن معرفی می‌شوند تا هر زمان که خواستی مسیرت را گسترش بدهی.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="theme-light relative isolate scroll-mt-24 bg-background text-foreground">
      {/* Tatami lattice texture — same motif as hero and features */}
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-bold text-primary">سوالات متداول</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">
              سوالی دارید؟ پاسخ اینجاست
            </h2>
            <BeltDivider fullWidth={false} variant="pill" className="mt-4 h-1 w-20" />
            <p className="mt-4 text-[15px] font-normal leading-8 text-muted-foreground sm:text-base sm:leading-9">
              چیزهایی که کاربران پیش از نصب تک‌یار از ما می‌پرسند؛ اگر پاسخت را
              پیدا نکردی، تیم ما یک پیام فاصله دارد.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
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
        </Reveal>

        {/* Contact CTA */}
        <Reveal delay={140}>
          <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl bg-card p-6 text-center shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:flex-row sm:gap-6 sm:p-7 sm:text-start">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
              <MessagesSquare className="!size-6" />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold">سوال دیگری دارید؟ با ما تماس بگیرید</h3>
              <p className="mt-1 text-sm font-normal leading-7 text-muted-foreground">
                تیم پشتیبانی تک‌یار در سریع‌ترین زمان ممکن پاسخگوی شماست.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-11 shrink-0 gap-2 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              <Link href="/contact">
                تماس با ما
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
