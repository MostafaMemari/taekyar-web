"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BreadcrumbSeparatorIcon } from "@/components/dashboard/shared/directional-icons";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";
import { resolveDashboardCrumbs } from "@/lib/dashboard-navigation";
import { cn } from "@/lib/utils";

interface DashboardBreadcrumbsProps {
  className?: string;
}

export function DashboardBreadcrumbs({ className }: DashboardBreadcrumbsProps) {
  const pathname = usePathname();
  const crumbs = resolveDashboardCrumbs(pathname);

  return (
    <nav aria-label={DASHBOARD_LABELS.breadcrumbLabel} className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-[13px] leading-5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.href} className={cn("flex min-w-0 items-center gap-1.5", isLast && "min-w-0 flex-1")}>
              {index > 0 ? (
                <BreadcrumbSeparatorIcon
                  className="size-3.5 shrink-0 text-muted-foreground/70"
                  aria-hidden="true"
                />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="min-w-0 truncate font-bold text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="shrink-0 rounded-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
