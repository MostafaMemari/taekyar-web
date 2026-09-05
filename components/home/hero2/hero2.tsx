import { Reveal } from "@/components/shared/reveal";

import { Hero2Character } from "./hero2-character";
import { Hero2Content } from "./hero2-content";

export function Hero2({ appDownloadUrl }: { appDownloadUrl?: string | null }) {
  return (
    <section className="theme-light relative isolate">
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
