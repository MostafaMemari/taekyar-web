import { Check } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { sectionVariants } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HERO_CONTENT, HERO_MICROCOPY, HERO_PRIMARY_CTA, HERO_SECONDARY_CTA } from "@/data/home/hero";
import { HeroCharacter } from "./character";

function HeroTitleLine({ prefix, highlight }: { prefix: string; highlight: string }) {
  return (
    <span className="block">
      {prefix} <span className="text-primary">{highlight}</span>
    </span>
  );
}

export function Hero({ appDownloadUrl }: { appDownloadUrl?: string | null }) {
  const downloadHref = appDownloadUrl ?? HERO_PRIMARY_CTA.href;

  return (
    <section className={cn(sectionVariants({ tone: "hero", spacing: "none" }))}>
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pb-20 lg:pt-16">
        <Reveal>
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-1.5 text-[13px] font-bold text-primary">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              {HERO_CONTENT.eyebrow}
            </span>

            <h1 className="mt-5 max-w-xl text-[2.125rem] font-black leading-[1.25] tracking-[-0.01em] sm:text-[2.75rem] sm:leading-[1.22] lg:text-[3.25rem] lg:leading-[1.18]">
              <HeroTitleLine {...HERO_CONTENT.title.line1} />
              <span className="mt-1 block">
                {HERO_CONTENT.title.line2.prefix}{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-b from-slate-700 via-slate-900 to-slate-900 bg-clip-text text-transparent">
                    {HERO_CONTENT.title.line2.highlight}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 220 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1.5 start-0 h-[0.22em] w-full opacity-40"
                  >
                    <defs>
                      <linearGradient id="hero-journey-stroke" x1="1" y1="0" x2="0" y2="0">
                        <stop offset="0" stopColor="#2563eb" />
                        <stop offset="1" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M4 9C60 3 160 3 216 8"
                      fill="none"
                      stroke="url(#hero-journey-stroke)"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-8 text-muted-foreground lg:max-w-lg">
              {HERO_CONTENT.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-xl px-6 text-[15px] font-bold shadow-md shadow-primary/25 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
              >
                <a
                  href={downloadHref}
                  {...(appDownloadUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <HERO_PRIMARY_CTA.Icon className="!size-[17px]" />
                  {HERO_PRIMARY_CTA.label}
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-12 gap-1.5 px-4 text-[15px] font-semibold text-muted-foreground hover:text-foreground"
              >
                <a href={HERO_SECONDARY_CTA.href}>
                  {HERO_SECONDARY_CTA.label}
                  <HERO_SECONDARY_CTA.Icon className="!size-4" />
                </a>
              </Button>
            </div>

            <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
              <Check aria-hidden="true" className="!size-4 text-primary" />
              {HERO_MICROCOPY}
            </p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <HeroCharacter />
        </Reveal>
      </div>
    </section>
  );
}
