import { Reveal } from "@/components/shared/reveal";

import { Hero2Character } from "./hero2-character";
import { Hero2Content } from "./hero2-content";

export function Hero2({ appDownloadUrl }: { appDownloadUrl?: string | null }) {
  return (
    <section className="theme-light relative isolate overflow-hidden border-b border-border/60 bg-background text-foreground">
      {/* TODO: Enable tatami background later
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" /> */}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[26rem] w-[52rem] max-w-none -translate-x-1/2 rounded-full bg-primary/[0.05] blur-3xl" />
        <div className="absolute -top-24 left-1/2 h-[30rem] w-[min(44rem,130%)] max-w-none -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl lg:top-1/2 lg:-left-40 lg:translate-x-0 lg:-translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(23,23,23,0.055)_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_78%,transparent)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-8 lg:pb-12 lg:pt-10">
        <Reveal className="order-2 lg:order-1">
          <Hero2Content appDownloadUrl={appDownloadUrl} />
        </Reveal>

        <Reveal delay={140} className="order-1 lg:order-2">
          <Hero2Character />
        </Reveal>
      </div>
    </section>
  );
}
