import { cn, toFaDigits } from "@/lib/utils";
import { BELT_LEVELS } from "@/data/shared/belts";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { BELT_JOURNEY_INTRO, BELT_JOURNEY_LABELS, CURRENT_BELT_INDEX } from "@/data/home/belt-journey";
import type { BeltState } from "./belt-icon";

function beltState(index: number): BeltState {
  if (index <= CURRENT_BELT_INDEX) return "earned";
  if (index === CURRENT_BELT_INDEX + 1) return "next";
  return "locked";
}

export function BeltJourney() {
  const current = BELT_LEVELS[CURRENT_BELT_INDEX];
  const next = BELT_LEVELS[CURRENT_BELT_INDEX + 1] ?? null;

  return (
    <Section tone="accent" containerClassName="py-6 sm:py-8">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary">{BELT_JOURNEY_INTRO.eyebrow}</p>
            <h2 className="mt-1 text-xl font-black leading-8 text-foreground sm:text-2xl sm:leading-9">
              {BELT_JOURNEY_INTRO.title}
            </h2>
          </div>
          <p className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs shadow-sm ring-1 ring-border/50">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: current.color }}
            />
            <span className="font-black text-foreground">کمربند {current.name}</span>
            <span className="font-medium text-muted-foreground">
              قدم {toFaDigits(CURRENT_BELT_INDEX + 1)} از {toFaDigits(BELT_LEVELS.length)}
            </span>
          </p>
        </div>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-7 text-muted-foreground">
          {BELT_JOURNEY_INTRO.description}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="relative mt-6 px-1 pt-6">
          <span
            aria-hidden="true"
            className="absolute inset-x-1 top-[28px] h-0.5 rounded-full bg-gradient-to-l from-primary/60 via-primary/25 to-foreground/10"
          />
          <ol className="relative flex items-start justify-between">
            {BELT_LEVELS.map(({ name, color }, index) => {
              const state = beltState(index);
              const isCurrent = index === CURRENT_BELT_INDEX;
              const isDestination = index === BELT_LEVELS.length - 1;
              return (
                <li key={name} aria-current={isCurrent ? "step" : undefined} className="relative flex flex-col items-center">
                  {state === "next" ? (
                    <span className="absolute -top-6 whitespace-nowrap text-[10px] font-bold text-primary">
                      {BELT_JOURNEY_LABELS.nextLabel}
                    </span>
                  ) : null}
                  <span
                    aria-hidden="true"
                    style={state === "earned" || isCurrent ? { backgroundColor: color } : undefined}
                    className={cn(
                      "rounded-full",
                      isCurrent && "size-3.5 shadow-[0_0_0_4px_rgba(37,99,235,0.22)]",
                      !isCurrent && state === "earned" && "size-2.5 shadow-sm",
                      !isCurrent && state === "earned" && color === "#ffffff" && "ring-1 ring-black/15",
                      state !== "earned" && !isCurrent && "size-2.5 border-2 bg-transparent",
                      state === "next" && "border-primary/60",
                      state === "locked" && (isDestination ? "border-foreground/50" : "border-foreground/25"),
                    )}
                  />
                  <span
                    className={cn(
                      "mt-2 whitespace-nowrap text-[10px] leading-5",
                      isCurrent && "font-black text-foreground",
                      !isCurrent && state === "earned" && "font-bold text-foreground",
                      state === "next" && "font-bold text-foreground",
                      state === "locked" &&
                        (isDestination ? "font-bold text-foreground" : "font-medium text-muted-foreground"),
                    )}
                  >
                    {name}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs">
          {next ? (
            <>
              <span className="font-medium text-muted-foreground">{BELT_JOURNEY_LABELS.nextPrefix}</span>
              <span className="font-bold text-primary">کمربند {next.name}</span>
            </>
          ) : (
            <span className="font-bold text-primary">{BELT_JOURNEY_LABELS.completedLabel}</span>
          )}
        </p>
      </Reveal>
    </Section>
  );
}
