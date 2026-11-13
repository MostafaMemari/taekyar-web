import { OVERVIEW_LABELS } from "@/data/dashboard/overview";
import { cn, toFaDigits } from "@/lib/utils";

interface ActivityChartProps {
  buckets: number[];
  total: number;
}

export function ActivityChart({ buckets, total }: ActivityChartProps) {
  const max = Math.max(1, ...buckets);

  return (
    <div>
      <div
        role="img"
        aria-label={`${OVERVIEW_LABELS.activityChartLabel} — ${toFaDigits(total)} ${OVERVIEW_LABELS.activityTotalSuffix}`}
      >
        <ul className="flex h-28 items-end gap-1 sm:gap-1.5">
          {buckets.map((count, index) => (
            <li key={index} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div
                className={cn("w-full rounded-sm", count > 0 ? "bg-primary" : "bg-muted")}
                style={{ height: count > 0 ? `${Math.max(8, (count / max) * 100)}%` : "4px" }}
                title={`${toFaDigits(count)} ${OVERVIEW_LABELS.activityTotalSuffix}`}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>{OVERVIEW_LABELS.activityOldest}</span>
        <span>{OVERVIEW_LABELS.activityNewest}</span>
      </div>
    </div>
  );
}
