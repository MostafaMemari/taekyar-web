import { Download } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { CTA_CONTENT } from "@/data/home/cta";

export function CtaSection({ appDownloadUrl }: { appDownloadUrl?: string | null }) {
  const downloadHref = appDownloadUrl ?? "/contact";

  return (
    <Section tone="dark" id="download">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_55%,#1d4ed8_100%)] px-6 pb-12 pt-14 text-center shadow-xl shadow-black/25 sm:px-12">
          <BeltDivider width="full"
            className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-90"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-black leading-snug text-white sm:text-4xl">
              {CTA_CONTENT.title}
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-white/85 sm:text-base">
              {CTA_CONTENT.description}
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 gap-2.5 rounded-xl bg-white px-7 text-base font-bold text-primary shadow-xl shadow-black/20 hover:bg-white/90"
            >
              <a
                href={downloadHref}
                {...(appDownloadUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Download />
                {CTA_CONTENT.cta}
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
