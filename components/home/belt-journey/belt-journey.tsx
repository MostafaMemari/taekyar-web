import { SURFACE_CARD } from "@/lib/styles";
import { cn, toFaDigits } from "@/lib/utils";
import { BELT_LEVELS } from "@/data/shared/belts";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { BELT_JOURNEY_INTRO, CURRENT_BELT_INDEX } from "@/data/home/belt-journey";
import { BeltIcon, type BeltState } from "./belt-icon";

function beltState(index: number): BeltState {
  if (index <= CURRENT_BELT_INDEX) return "earned";
  if (index === CURRENT_BELT_INDEX + 1) return "next";
  return "locked";
}

export function BeltJourney() {
  const current = BELT_LEVELS[CURRENT_BELT_INDEX];

  return (
    <Section containerClassName="py-10 sm:py-12 lg:py-14">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader {...BELT_JOURNEY_INTRO} className="max-w-xl" />
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[13px] font-bold text-primary">
            <span className="size-2 rounded-full bg-primary" />
            کمربند {current.name}
          </span>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className={cn(SURFACE_CARD, "mt-8 px-4 py-6 sm:px-8 lg:mt-10")}>
          <ol className="grid grid-cols-6 items-start gap-1 sm:gap-2">
            {BELT_LEVELS.map(({ name, color }, index) => {
              const state = beltState(index);
              const isCurrent = index === CURRENT_BELT_INDEX;
              return (
                <li key={name} className="flex min-w-0 flex-col items-center text-center">
                  <span
                    className={cn(
                      "flex w-full items-center justify-center rounded-xl px-1 py-2 transition-colors",
                      isCurrent && "bg-primary/[0.07] ring-1 ring-primary/40"
                    )}
                  >
                    <BeltIcon color={color} state={state} className="w-full max-w-16" />
                  </span>
                  <span
                    className={cn(
                      "mt-2 text-[10px] leading-4 sm:text-[11px]",
                      isCurrent
                        ? "font-bold text-foreground"
                        : state === "locked"
                          ? "font-medium text-muted-foreground/60"
                          : "font-medium text-muted-foreground"
                    )}
                  >
                    {name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 h-1 w-1 rounded-full",
                      isCurrent ? "bg-primary" : "bg-transparent"
                    )}
                  />
                </li>
              );
            })}
          </ol>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.round(((CURRENT_BELT_INDEX + 1) / BELT_LEVELS.length) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
            قدم {toFaDigits(CURRENT_BELT_INDEX + 1)} از {toFaDigits(BELT_LEVELS.length)}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
