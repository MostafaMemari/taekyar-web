"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessagesSquare } from "lucide-react";

import { DashboardBreadcrumbs } from "@/components/dashboard/layout/dashboard-breadcrumbs";
import { DashboardCommandMenu } from "@/components/dashboard/layout/dashboard-command-menu";
import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { DashboardUserMenu } from "@/components/dashboard/layout/dashboard-user-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";
import { useMediaQuery } from "@/hooks/use-media-query";
import { resolveDashboardTitle } from "@/lib/dashboard/dashboard-navigation";
import { toFaDigits } from "@/lib/utils";

interface DashboardTopbarProps {
  username: string;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  pendingCount?: number;
}

export function DashboardTopbar({
  username,
  siteName,
  logoImage,
  logoImageAlt,
  pendingCount = 0,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [wasDesktop, setWasDesktop] = useState(isDesktop);
  const title = resolveDashboardTitle(pathname);

  if (wasDesktop !== isDesktop) {
    setWasDesktop(isDesktop);
    if (isDesktop) setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex h-15 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={DASHBOARD_LABELS.openMenu}
              className="size-10 shrink-0 rounded-lg text-foreground lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="theme-admin w-[300px] gap-0 bg-card p-0 sm:w-[320px] lg:hidden"
            aria-label={DASHBOARD_LABELS.sectionLabel}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{DASHBOARD_LABELS.panel}</SheetTitle>
            </SheetHeader>
            <DashboardSidebar
              username={username}
              siteName={siteName}
              logoImage={logoImage}
              logoImageAlt={logoImageAlt}
              pendingCount={pendingCount}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <p className="min-w-0 flex-1 truncate text-[15px] font-bold leading-5 text-foreground lg:hidden">{title}</p>

        <DashboardBreadcrumbs className="hidden min-w-0 lg:block lg:flex-1" />

        <div className="flex shrink-0 items-center gap-1.5">
          <DashboardCommandMenu />

          {pendingCount > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label={`${DASHBOARD_LABELS.pendingTitle}: ${toFaDigits(pendingCount)}`}
              title={DASHBOARD_LABELS.pendingTitle}
              className="relative size-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Link href="/dashboard/comments?status=PENDING">
                <MessagesSquare className="size-4" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute end-1 top-1 flex size-4 items-center justify-center rounded-full bg-warning text-[10px] font-bold tabular-nums text-warning-foreground"
                >
                  {toFaDigits(pendingCount)}
                </span>
              </Link>
            </Button>
          ) : null}

          <DashboardUserMenu username={username} />
        </div>
      </div>
    </header>
  );
}
