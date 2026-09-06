import { HERO2_PRIMARY_CTA, HERO2_SECONDARY_CTA } from "@/data/home/hero2";

import { Button } from "@/components/ui/button";

interface Hero2CtaProps {
  appDownloadUrl?: string | null;
}

export function Hero2Cta({ appDownloadUrl }: Hero2CtaProps) {
  const downloadHref = appDownloadUrl ?? "#download";

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
      <Button
        asChild
        size="lg"
        className="h-12 gap-2 rounded-xl px-6 text-[15px] font-bold shadow-md shadow-primary/25 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
      >
        <a href={HERO2_PRIMARY_CTA.href}>
          {HERO2_PRIMARY_CTA.label}
          <HERO2_PRIMARY_CTA.Icon className="!size-[17px]" />
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="group h-12 gap-2.5 rounded-xl px-5 text-[15px] font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted"
      >
        <a href={HERO2_SECONDARY_CTA.href}>
          {HERO2_SECONDARY_CTA.label}
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:scale-105">
            <HERO2_SECONDARY_CTA.Icon className="size-3 fill-current" />
          </span>
        </a>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="lg"
        className="h-12 gap-2 px-4 text-[15px] font-semibold text-muted-foreground hover:text-foreground"
      >
        <a href={downloadHref} {...(appDownloadUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          دانلود اپلیکیشن
        </a>
      </Button>
    </div>
  );
}
