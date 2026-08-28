"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { SURFACE_CARD } from "@/lib/styles";
import { ABOUT_MOTTO_CARD } from "@/data/about";
import { cn, toFaDigits } from "@/lib/utils";

const SHEET =
  "pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-card shadow-sm shadow-black/[0.05] ring-1 ring-black/[0.05]";

const NAV_BUTTON =
  "flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function MottoCard() {
  const { quotes, navLabels } = ABOUT_MOTTO_CARD;
  const [active, setActive] = useState(0);
  const count = quotes.length;
  const current = quotes[active];
  const moveTo = (step: number) => setActive((previous) => (previous + step + count) % count);

  return (
    <figure className={cn(SURFACE_CARD, "relative p-6 sm:p-7")}>
      <span aria-hidden="true" className={cn(SHEET, "rotate-[1.6deg]")} />
      <span aria-hidden="true" className={cn(SHEET, "-rotate-[1.6deg]")} />

      <BeltDivider variant="pill" width="contained" className="h-1 w-14" />

      <div aria-live="polite" className="grid py-5">
        {quotes.map((item, index) => (
          <blockquote
            key={item.author}
            aria-hidden={index !== active}
            className={cn(
              "[grid-area:1/1] text-balance text-lg font-extrabold leading-9 transition-all duration-300 ease-out sm:text-xl sm:leading-10 motion-reduce:transition-none",
              index === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1.5 opacity-0",
            )}
          >
            «{item.quote}»
          </blockquote>
        ))}
      </div>

      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-t border-black/[0.05] pt-4">
        <span className="flex items-center gap-2 text-xs font-bold text-foreground sm:text-[13px]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          {current.author}
        </span>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveTo(-1)} aria-label={navLabels.prev} className={NAV_BUTTON}>
            <ArrowRight className="size-4" />
          </button>
          <span className="min-w-9 text-center text-xs font-medium tabular-nums text-muted-foreground" aria-hidden="true">
            {toFaDigits(active + 1)} / {toFaDigits(count)}
          </span>
          <button type="button" onClick={() => moveTo(1)} aria-label={navLabels.next} className={NAV_BUTTON}>
            <ArrowLeft className="size-4" />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
