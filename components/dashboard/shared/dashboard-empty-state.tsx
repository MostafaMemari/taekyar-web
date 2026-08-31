import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { CardContent } from "@/components/ui/card";

interface DashboardEmptyStateProps {
  title: string;
  hint: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function DashboardEmptyState({ title, hint, icon, action }: DashboardEmptyStateProps) {
  return (
    <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </span>
      <p className="mt-3 text-[14px] font-bold">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{hint}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </CardContent>
  );
}
