import { HERO2_DESCRIPTION, HERO2_EYEBROW, HERO2_TITLE } from "@/data/home/hero2";

import { Hero2Cta } from "./hero2-cta";

interface Hero2ContentProps {
  appDownloadUrl?: string | null;
}

export function Hero2Content({ appDownloadUrl }: Hero2ContentProps) {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-1.5 text-[13px] font-bold text-primary">
        <span className="size-1.5 rounded-full bg-primary" />
        {HERO2_EYEBROW}
      </span>

      <h1 className="mt-4 max-w-xl text-[2.125rem] font-black leading-[1.25] tracking-[-0.01em] sm:text-[2.75rem] sm:leading-[1.22] lg:text-[3.25rem] lg:leading-[1.18]">
        <span className="block">{HERO2_TITLE.line1}</span>
        <span className="block">
          {HERO2_TITLE.line2Prefix}{" "}
          <span className="relative inline-block text-primary">
            {HERO2_TITLE.highlight}
            <svg
              aria-hidden="true"
              viewBox="0 0 220 12"
              preserveAspectRatio="none"
              className="absolute -bottom-1.5 start-0 h-[0.22em] w-full text-primary/30"
            >
              <path
                d="M4 9C60 3 160 3 216 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
      </h1>

      <p className="mt-5 max-w-md text-[15px] leading-7 text-muted-foreground lg:max-w-lg">
        {HERO2_DESCRIPTION}
      </p>

      <Hero2Cta appDownloadUrl={appDownloadUrl} />
    </div>
  );
}
