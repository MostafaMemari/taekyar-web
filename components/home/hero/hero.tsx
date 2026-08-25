import { Check, Download } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "./phone-mockup";
import { TRUST_BADGES } from "./data";

export function Hero() {
  return (
    <section className="theme-light relative isolate overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-10 pt-10 sm:px-6 sm:pb-11 sm:pt-12 lg:grid-cols-[1fr_0.9fr] lg:gap-10 lg:px-8 lg:pb-12 lg:pt-14">
        <Reveal>
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
              <span className="h-px w-6 bg-primary/40" />
              همراه هوشمند تمرین تکواندو
            </span>

            <h1 className="mt-4 max-w-xl text-[2rem] font-black leading-[1.3] tracking-[-0.01em] sm:text-[2.75rem] sm:leading-[1.25] lg:mt-5 lg:text-[3.25rem] lg:leading-[1.22]">
              <span className="block">از اولین ضربه،</span>
              <span className="block">
                تا <span className="text-primary">کمربند سیاه.</span>
              </span>
            </h1>

            <p className="mt-4 max-w-md text-[15px] leading-8 text-muted-foreground lg:mt-5 lg:max-w-lg">
              تک‌یار همراه هوشمند تو در دنیای تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام
              فن‌ها و پیگیری دقیق مسیر ارتقای کمربند — همه در یک اپلیکیشن.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 lg:mt-9 lg:justify-start">
              <Button
                type="button"
                size="lg"
                className="h-11 gap-2 rounded-lg px-5 text-[15px] font-bold shadow-sm shadow-primary/25"
              >
                <Download className="!size-[17px]" />
                دانلود اپلیکیشن
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-11 px-4 text-[15px] font-semibold text-muted-foreground hover:text-foreground"
              >
                <a href="#features">مشاهده امکانات</a>
              </Button>
            </div>

            <ul className="mt-8 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-black/[0.06] pt-5 lg:mt-10 lg:justify-start lg:pt-6">
              {TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Check className="size-3.5 shrink-0 text-belt-green" strokeWidth={2.5} />
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  );
}
