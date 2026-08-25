import { Check, ChevronDown, Download, Medal } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "./phone-mockup";
import { TRUST_BADGES } from "./data";

export function Hero() {
  return (
    <section className="theme-light relative isolate overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_88%_18%,rgba(224,40,46,0.05),transparent_62%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-16">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
              <Medal className="size-3.5 text-primary" />
              همراه هوشمند تمرین تکواندو
            </span>

            <h1 className="mt-5 max-w-2xl text-[2.4rem] font-black leading-[1.25] sm:text-6xl sm:leading-[1.15] lg:text-[4.35rem] lg:leading-[1.12]">
              <span className="block">از اولین ضربه،</span>
              <span className="block">
                تا{" "}
                <span className="bg-gradient-to-l from-[#f04a4f] via-primary to-[#8f1216] bg-clip-text text-transparent">
                  کمربند سیاه.
                </span>
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
              تک‌یار همراه هوشمند تو در دنیای تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها
              و پیگیری دقیق مسیر ارتقای کمربند — همه در یک اپلیکیشن.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                className="h-12 gap-2 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                <Download className="!size-[18px]" />
                دانلود اپلیکیشن
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-xl border-border bg-card px-6 text-[15px] font-bold text-foreground shadow-sm hover:bg-muted dark:border-border dark:bg-card dark:hover:bg-muted"
              >
                <a href="#features">
                  مشاهده امکانات
                  <ChevronDown className="!size-4" />
                </a>
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-belt-green/15 text-belt-green">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
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
