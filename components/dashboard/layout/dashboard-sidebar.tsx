"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Shield } from "lucide-react";

import { Wordmark } from "@/components/layout/header/wordmark";
import { BeltDivider } from "@/components/shared/belt-divider";
import { Separator } from "@/components/ui/separator";
import { DASHBOARD_LABELS, DASHBOARD_NAV } from "@/data/dashboard/ui";
import { logout } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const initial = username.trim().charAt(0).toUpperCase() || "م";

  return (
    <aside className="relative flex h-full w-full flex-col bg-card lg:border-e lg:border-border/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-90">
        <BeltDivider width="full" className="h-full border-0" />
      </div>

      <div className="px-5 pb-4 pt-5">
        <Wordmark />
        <p className="mt-1.5 ps-0.5 text-[11px] font-medium tracking-widest text-muted-foreground">{DASHBOARD_LABELS.panel}</p>
      </div>

      <div className="px-5">
        <Separator className="bg-border/60" />
      </div>

      <div className="px-3 py-3">
        <p className="px-2 pb-2 text-[10px] font-bold tracking-[0.12em] text-muted-foreground/70">مدیریت محتوا</p>
        <nav aria-label={DASHBOARD_LABELS.sectionLabel} className="flex flex-col gap-1">
          {DASHBOARD_NAV.map(({ href, label, Icon }) => {
            const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-h-10 items-center gap-3 rounded-xl border border-transparent px-2.5 text-[13px] leading-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0 motion-reduce:transition-none",
                  active
                    ? "border-primary/10 bg-primary/[0.07] ps-2 font-bold text-primary shadow-sm shadow-primary/[0.04] border-s-2 border-s-primary"
                    : "font-medium text-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg border text-[13px] transition-colors motion-reduce:transition-none",
                    active
                      ? "border-primary/15 bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border-border bg-card text-foreground/70 group-hover:border-primary/15 group-hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 truncate text-start">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="px-5">
          <Separator className="bg-border/60" />
        </div>

        <div className="p-3">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-black text-background ring-1 ring-border">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-muted-foreground text-[13px] font-bold leading-4">{username}</p>
                <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Shield className="size-3 shrink-0" aria-hidden="true" />
                  مدیر
                </p>
              </div>
            </div>

            <Separator className="my-3 bg-border/60" />

            <div className="grid gap-1">
              <Link
                href="/"
                className="flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                {DASHBOARD_LABELS.viewSite}
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
                >
                  <LogOut className="size-4 shrink-0" aria-hidden="true" />
                  {DASHBOARD_LABELS.logout}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
