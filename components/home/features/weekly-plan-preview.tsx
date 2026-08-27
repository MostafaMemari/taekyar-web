import { cn } from "@/lib/utils";
import { WEEKLY_PLAN, WEEKLY_STATS } from "@/data/home/features";

function PlanHeader() {
  return (
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
  );
}

function PlanStats() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {WEEKLY_STATS.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl bg-card p-2.5 text-center ring-1 ring-black/[0.04]"
        >
          <p className="text-base font-black leading-none text-foreground">{value}</p>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

function PlanWeek() {
  return (
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
                !active &&
                  !done &&
                  !rest &&
                  "bg-foreground/[0.1] group-hover/day:bg-foreground/[0.18]",
                rest &&
                  "bg-[repeating-linear-gradient(45deg,rgba(23,23,23,0.07)_0_2px,transparent_2px_5px)] ring-1 ring-inset ring-foreground/[0.08]"
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
  );
}

export function WeeklyPlanPreview() {
  return (
    <div className="rounded-2xl bg-[#fafaf8] p-4 ring-1 ring-black/[0.05] sm:p-5">
      <PlanHeader />
      <PlanStats />
      <PlanWeek />
    </div>
  );
}
