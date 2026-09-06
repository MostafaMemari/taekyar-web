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
    <Section tone="accent" containerClassName="py-10 sm:py-12 lg:py-14">
      <Reveal>
        <SectionHeader {...BELT_JOURNEY_INTRO} className="max-w-xl" />
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-10 lg:mt-12">
          <ol className="grid grid-cols-6 items-start gap-1 sm:gap-3">
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
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round(((CURRENT_BELT_INDEX + 1) / BELT_LEVELS.length) * 100)}%` }}
              />
            </div>
            <p className="mt-2.5 text-center text-xs font-medium text-muted-foreground">
              قدم {toFaDigits(CURRENT_BELT_INDEX + 1)} از {toFaDigits(BELT_LEVELS.length)} · کمربند {current.name}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
