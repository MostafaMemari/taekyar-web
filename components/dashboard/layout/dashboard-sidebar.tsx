"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

import { Wordmark } from "@/components/layout/header/wordmark";
import { DASHBOARD_LABELS, DASHBOARD_NAV } from "@/data/dashboard/ui";
import { logout } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-black/[0.06] bg-card lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-e">
      <div className="hidden border-b border-black/[0.06] px-5 py-4 lg:block">
        <Wordmark />
      </div>

      <nav
        aria-label={DASHBOARD_LABELS.sectionLabel}
        className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible"
      >
        {DASHBOARD_NAV.map(({ href, label, Icon }) => {
          const active =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-bold text-primary"
                  : "font-medium text-muted-foreground hover:bg-black/[0.03] hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-black/[0.06] p-3">
        <p className="truncate px-3 pb-1 text-xs font-medium text-muted-foreground">
          {username}
        </p>

        <Link
          href="/"
          className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/[0.03] hover:text-foreground"
        >
          <ExternalLink className="size-4 shrink-0" />
          {DASHBOARD_LABELS.viewSite}
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4 shrink-0" />
            {DASHBOARD_LABELS.logout}
          </button>
        </form>
      </div>
    </aside>
  );
}
