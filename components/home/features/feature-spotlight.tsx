import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  FEATURE_MAIN,
  WEEK_STRIP_DAYS,
  WEEK_STRIP_SUMMARY,
  WEEK_STRIP_TITLE,
  type WeekDayState,
} from "@/data/home/features";

const DAY_BAR_STYLES: Record<WeekDayState, string> = {
  done: "bg-primary/60",
  today: "bg-primary shadow-sm shadow-primary/40 ring-1 ring-primary",
  todo: "bg-foreground/10",
  rest: "border border-dashed border-border bg-transparent",
};

function WeekStrip() {
  return (
    <div aria-hidden="true" className="mt-6 rounded-xl bg-muted/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold text-foreground">{WEEK_STRIP_TITLE}</p>
        <p className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
          {WEEK_STRIP_SUMMARY.sessions}
        </p>
      </div>
      <div className="mt-4 flex h-24 items-end gap-2">
        {WEEK_STRIP_DAYS.map(({ day, height, state }) => (
          <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div
              className={cn("w-full max-w-6 rounded-md", DAY_BAR_STYLES[state])}
              style={{ height: `${Math.max(height, state === "rest" ? 12 : 8)}%` }}
            />
            <span className="text-[10px] font-bold text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-border/60 pt-3 text-center text-[11px] font-medium text-muted-foreground">
        {WEEK_STRIP_SUMMARY.minutes}
      </p>
    </div>
  );
}

export function FeatureSpotlight() {
  const { Icon, tint, title, description } = FEATURE_MAIN;

  return (
    <article className={cn(SURFACE_CARD, SURFACE_CARD_INTERACTIVE, "flex h-full flex-col p-5 sm:p-7")}>
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tint)}>
        <Icon className="!size-[22px]" />
      </span>
      <h3 className="mt-4 text-xl font-extrabold leading-8 sm:text-2xl sm:leading-9">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
      <WeekStrip />
    </article>
  );
}
