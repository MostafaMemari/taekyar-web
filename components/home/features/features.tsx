import { Check } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  BELT_PATH,
  FEATURED_FEATURE,
  PLAN_CHIPS,
  SUPPORTING_FEATURES,
  WEEKLY_PLAN,
  WEEKLY_STATS,
} from "./data";

function WeeklyPlanPreview() {
  return (
    <div className="rounded-2xl bg-[#fafaf8] p-4 ring-1 ring-black/[0.05] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-foreground">بار تمرین این هفته</p>
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            هفته چهارم · کمربند سبز
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          امروز: کیوروگی
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {WEEKLY_STATS.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-card p-2.5 text-center ring-1 ring-black/[0.04]">
            <p className="text-base font-black leading-none text-foreground">{value}</p>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <ol className="mt-4 flex items-end justify-between gap-1.5 sm:gap-2">
        {WEEKLY_PLAN.map(({ day, label, Icon, load, minutes, done, active, rest }) => (
          <li key={day} className="group/day flex flex-1 flex-col items-center gap-2">
            <span
              className={cn(
                "text-[9px] font-bold tabular-nums",
                active ? "text-primary" : "text-transparent"
              )}
            >
              {minutes}′
            </span>

            <div className="flex h-24 w-full items-end justify-center">
              <div
                className={cn(
                  "w-full max-w-7 rounded-md transition-all duration-300",
                  active && "bg-primary shadow-sm shadow-primary/40",
                  done && "bg-primary/25",
                  !active && !done && !rest && "bg-foreground/[0.1] group-hover/day:bg-foreground/[0.18]",
                  rest && "bg-[repeating-linear-gradient(45deg,rgba(23,23,23,0.07)_0_2px,transparent_2px_5px)] ring-1 ring-inset ring-foreground/[0.08]"
                )}
                style={{ height: `${Math.max(load, 10)}%` }}
              />
            </div>

            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-primary text-white"
                  : done
                    ? "bg-primary/10 text-primary"
                    : "bg-card text-muted-foreground ring-1 ring-black/[0.05]"
              )}
            >
              <Icon className="size-3.5" />
            </span>

            <div className="text-center">
              <span
                className={cn(
                  "block text-[11px] font-bold",
                  active ? "text-primary" : "text-foreground/70"
                )}
              >
                {day}
              </span>
              <span className="mt-0.5 hidden text-[9px] text-muted-foreground sm:block">
                {label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BeltPath() {
  return (
    <div className={cn(SURFACE_CARD, "mt-5 p-5 sm:p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-extrabold">مسیر کمربند تو</p>
        <p className="text-xs font-medium text-muted-foreground">
          الان: کمربند سبز · قدم بعدی: آبی
        </p>
      </div>

      <ol className="mt-5 flex items-center gap-1.5 sm:gap-3">
        {BELT_PATH.map(({ name, color }, index) => {
          const reached = index <= 2;

          return (
            <li key={name} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center gap-1.5 sm:gap-2">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 sm:size-7",
                    !reached && "opacity-35"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {reached ? (
                    <Check
                      className={cn(
                        "size-3",
                        name === "سفید" || name === "زرد" ? "text-black/70" : "text-white"
                      )}
                      strokeWidth={3}
                    />
                  ) : null}
                </span>
                {index < BELT_PATH.length - 1 ? (
                  <span
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      index < 2 ? "bg-primary/70" : "bg-foreground/[0.08]"
                    )}
                  />
                ) : null}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium sm:text-[11px]",
                  reached ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Features() {
  const { Icon: FeaturedIcon, title, description } = FEATURED_FEATURE;

  return (
    <Section id="features" className="bg-[#f5f5f4]">
      <Reveal>
        <SectionHeader
          eyebrow="چرا تک‌یار؟"
          title="تمرین هوشمند، پیشرفت واقعی"
          description="تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست. هرچه برای رشد در تکواندو لازم داری، اینجا کنار هم است."
        />
      </Reveal>

      <div className="mt-10 lg:mt-12">
        <Reveal>
          <article className={cn(SURFACE_CARD, "overflow-hidden")}>
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:p-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                  <FeaturedIcon className="size-3.5" />
                  قلب تک‌یار
                </span>
                <h3 className="mt-4 text-2xl font-extrabold leading-[1.35] sm:text-3xl sm:leading-[1.3]">
                  {title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-8 text-muted-foreground">
                  {description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {PLAN_CHIPS.map((chip) => (
                    <li
                      key={chip}
                      className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
                    >
                      <Check className="size-3 text-belt-green" strokeWidth={3} />
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>

              <WeeklyPlanPreview />
            </div>
          </article>
        </Reveal>

        <Reveal delay={80}>
          <BeltPath />
        </Reveal>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {SUPPORTING_FEATURES.map(({ Icon, tint, title: cardTitle, description: cardDescription }, index) => (
            <Reveal key={cardTitle} delay={(index + 1) * 80}>
              <article
                className={cn(
                  SURFACE_CARD,
                  SURFACE_CARD_INTERACTIVE,
                  "h-full p-5 sm:p-6"
                )}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full",
                    tint
                  )}
                >
                  <Icon className="!size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{cardTitle}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {cardDescription}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
