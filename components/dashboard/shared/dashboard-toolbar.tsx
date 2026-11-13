import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn, toFaDigits } from "@/lib/utils";

interface DashboardToolbarProps {
  children: ReactNode;
  className?: string;
}

export function DashboardToolbar({ children, className }: DashboardToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5 border-b border-border px-3 py-3 sm:px-4", className)}>
      {children}
    </div>
  );
}

interface DashboardSearchFieldProps {
  action: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  name?: string;
  className?: string;
}

export function DashboardSearchField({
  action,
  label,
  placeholder,
  defaultValue,
  name = "q",
  className,
}: DashboardSearchFieldProps) {
  return (
    <form
      role="search"
      aria-label={label}
      action={action}
      className={cn("relative min-w-[12rem] flex-1", className)}
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 rounded-lg border-border bg-background ps-9 pe-3 text-sm"
      />
    </form>
  );
}

interface DashboardCountChipProps {
  count: number;
  suffix?: string;
  className?: string;
}

export function DashboardCountChip({ count, suffix, className }: DashboardCountChipProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold tabular-nums text-muted-foreground",
        className,
      )}
    >
      {toFaDigits(count)}
      {suffix ? <span className="ms-1">{suffix}</span> : null}
    </span>
  );
}
