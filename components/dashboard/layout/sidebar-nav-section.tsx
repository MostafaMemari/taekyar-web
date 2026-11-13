import Link from "next/link";

import { DASHBOARD_LABELS } from "@/data/dashboard/layout";
import { isDashboardNavItemActive, type DashboardNavItem } from "@/data/dashboard/navigation";
import { cn, toFaDigits } from "@/lib/utils";

interface SidebarNavSectionProps {
  items: DashboardNavItem[];
  pathname: string;
  label?: string;
  pendingCount?: number;
  onNavigate?: () => void;
}

export function SidebarNavSection({
  items,
  pathname,
  label,
  pendingCount = 0,
  onNavigate,
}: SidebarNavSectionProps) {
  return (
    <div>
      {label ? (
        <p className="px-2.5 pb-1.5 pt-4 text-[11px] font-semibold leading-4 text-muted-foreground">{label}</p>
      ) : null}
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isDashboardNavItemActive(pathname, item);
          const count = item.badgeKey === "pendingComments" ? pendingCount : 0;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 text-[13px] leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
                  active
                    ? "bg-primary/10 font-bold text-primary"
                    : "font-medium text-foreground/80 hover:bg-muted hover:text-foreground",
                )}
              >
                <item.Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-start">{item.label}</span>
                {count > 0 ? (
                  <span className="shrink-0 rounded-md bg-warning-subtle px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-warning">
                    <span className="sr-only">{DASHBOARD_LABELS.pendingBadge}: </span>
                    {toFaDigits(count)}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
