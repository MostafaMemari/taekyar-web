import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import type { DashboardNavIcon } from "@/data/dashboard/navigation";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  description?: string;
  Icon?: DashboardNavIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DashboardSection({
  title,
  description,
  Icon,
  action,
  children,
  className,
  contentClassName,
}: DashboardSectionProps) {
  return (
    <Card className={cn("gap-0 rounded-xl p-0 shadow-none", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon ? (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-[22px] text-foreground">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn("p-4", contentClassName)}>{children}</div>
    </Card>
  );
}
