import { Download } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { CTA_CONTENT } from "./data";

export function CtaSection() {
  return (
    <Section containerClassName="pt-0 sm:pt-0 lg:pt-0">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#e0282e_0%,#b01d22_55%,#701014_100%)] px-6 pb-12 pt-14 text-center shadow-xl shadow-primary/25 sm:px-12">
          <BeltDivider
            fullWidth
            className="absolute inset-x-0 top-0 border-0 opacity-90"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0_3px,transparent_3px_56px)]"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-black leading-snug text-white sm:text-4xl">
              {CTA_CONTENT.title}
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-white/85 sm:text-base">
              {CTA_CONTENT.description}
            </p>
            <Button
              type="button"
              size="lg"
              className="mt-8 h-12 gap-2.5 rounded-xl bg-white px-7 text-base font-bold text-primary shadow-xl shadow-black/20 hover:bg-white/90"
            >
              <Download />
              {CTA_CONTENT.cta}
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
