import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RowActionButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-10 rounded-lg text-muted-foreground hover:text-foreground", className)}
      {...props}
    />
  );
}

export const ROW_ACTION_DESTRUCTIVE_CLASS =
  "hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20";

export const ROW_ACTION_PRIMARY_CLASS =
  "hover:bg-primary/10 hover:text-primary focus-visible:border-primary/40 focus-visible:ring-primary/20";
