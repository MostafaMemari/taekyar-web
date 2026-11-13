import type { ReactNode } from "react";
import { Inbox, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  title: string;
  hint: string;
  icon?: ReactNode;
  action?: ReactNode;
  variant?: "empty" | "error";
  className?: string;
}

export function DashboardEmptyState({
  title,
  hint,
  icon,
  action,
  variant = "empty",
  className,
}: DashboardEmptyStateProps) {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          isError ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
        )}
      >
        {icon ?? (
          isError ? (
            <TriangleAlert className="size-6" aria-hidden="true" />
          ) : (
            <Inbox className="size-6" aria-hidden="true" />
          )
        )}
      </span>
      <p className="mt-3 text-sm font-bold leading-[22px] text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] leading-5 text-muted-foreground">{hint}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
