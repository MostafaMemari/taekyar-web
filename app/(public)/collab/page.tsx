import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Handshake, PenLine, Store } from "lucide-react";

import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { toFaDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "همکاری با تک‌یار",
  description:
    "مربی هستی، برند ورزشی داری یا محتوای تکواندو تولید می‌کنی؟ راه‌های همکاری با تک‌یار را ببین و شروع کن.",
  alternates: { canonical: "/collab" },
};

const COOP_PATHS = [
  {
    Icon: PenLine,
    title: "مربی‌ها و مدرس‌ها",
    description:
      "برنامه تمرینی، نکته فنی یا تجربه باشگاهی داری؟ با نام خودت در بلاگ تک‌یار منتشرش می‌کند و خواننده‌هایت را از سراسر ایران می‌گیری.",
    points: ["نوشته آموزشی یا ویدیوی اجرای فن", "بازخورد فنی روی محتوا", "معرفی مربی با لینک صفحه تو"],
  },
  {
    Icon: Store,
    title: "برندها و اسپانسرها",
    description:
      "محصول مرتبط با ورزشکاران داری؟ لوازم تمرین، پوشاک یا تغذیه ورزشی؛ جاهای هوشمند سایت و اپلیکیشن برای معرفی درست محصول داریم.",
    points: ["معرفی در مقاله‌های مرتبط", "بنر و جایگاه در اپلیکیشن", "کمپین محتوایی مشترک"],
  },
  {
    Icon: Handshake,
    title: "باشگاه‌ها و آکادمی‌ها",
    description:
      "باشگاه تو از اپلیکیشن تک‌یار برای شاگردهایش استفاده می‌کند و ما هم باشگاه را معرفی می‌کنیم؛ همکاری دوطرفه با قرارداد شفاف.",
    points: ["صفحه معرفی باشگاه", "دعوت شاگردها به اپلیکیشن", "رویداد و آزمون مشترک"],
  },
];

const COOP_STEPS = [
  { title: "خودت را معرفی کن", description: "از صفحه تماس بنویس چه کسی هستی و چه همکاری در سر داری." },
  { title: "جزئیات را بچینیم", description: "یک جلسه کوتاه یا مکاتب؛ هدف، محتوا و زمان‌بندی را مشخص می‌کنیم." },
  { title: "شروع می‌کنیم", description: "اولین همکاری را اجرا می‌کنیم و بعد از نتیجه، مسیر بلندمدت را می‌چینیم." },
];

export default function CollabPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "همکاری با ما", path: "/collab" },
        ])}
      />
      <div className="bg-warm-dots">
        <Section spacing="none" containerClassName="pb-10 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
          <Reveal>
            <h1 className="text-center text-balance font-heading text-[2rem] leading-[1.4] text-[#c79500] sm:text-[2.75rem] sm:leading-[1.3] lg:text-[3.25rem] lg:leading-[1.25]">
              همکاری با تک‌یار
            </h1>
            <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
              <span className="size-1.5 rotate-45 bg-[#E0A800]" />
              <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-pretty text-[15px] leading-8 text-black/55">
              تک‌یار با آدم‌های واقعی دنیای تکواندو بزرگ می‌شود؛ مربی‌هایی که تجربه دارند، برندهایی که محصول درست می‌سازند و باشگاه‌هایی که حرفه‌ای کار می‌کنند. اگر یکی از این‌هایی، جای تو اینجاست.
            </p>
          </Reveal>
        </Section>

        <Section spacing="none" containerClassName="pb-12 sm:pb-14">
          <ul className="grid gap-4 lg:grid-cols-3">
            {COOP_PATHS.map((path) => (
              <li key={path.title}>
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]">
                    <path.Icon className="size-5" />
                  </span>
                  <h2 className="mt-4 font-heading text-xl leading-[1.5] text-[#1b2330]">{path.title}</h2>
                  <p className="mt-2 text-[13px] leading-7 text-black/55">{path.description}</p>
                  <ul className="mt-4 space-y-2 border-t border-dashed border-black/[0.08] pt-4">
                    {path.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-[12.5px] font-medium text-black/55">
                        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-[2px] bg-[#E0A800]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-3xl border border-[#E0A800]/25 bg-gradient-to-bl from-[#FDF6E1] to-[#F9EDCB] p-6 sm:p-8">
            <h2 className="text-center font-heading text-2xl text-[#1b2330]">چطور شروع کنیم؟</h2>
            <ol className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
              {COOP_STEPS.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-black/[0.06] bg-white/80 p-5 text-center">
                  <span className="mx-auto flex size-8 items-center justify-center rounded-full bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-sm font-black text-[#2A1F00]">
                    {toFaDigits(index + 1)}
                  </span>
                  <h3 className="mt-3 text-[14px] font-extrabold text-[#1b2330]">{step.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-black/55">{step.description}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-6 py-3 text-sm font-extrabold text-[#2A1F00] shadow-[0_10px_20px_-8px_rgba(154,109,0,0.7)] transition-all duration-200 hover:-translate-y-px"
              >
                ارسال پیشنهاد همکاری
                <ArrowLeft className="size-4" />
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
