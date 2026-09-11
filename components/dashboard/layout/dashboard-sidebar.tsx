"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Shield } from "lucide-react";

import { SidebarNavSection } from "@/components/dashboard/layout/sidebar-nav-section";
import { Logo } from "@/components/layout/header/logo";
import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import { DASHBOARD_LABELS, DASHBOARD_NAV_PRIMARY, DASHBOARD_NAV_SECTIONS } from "@/data/dashboard/ui";
import { logout } from "@/lib/admin-actions";

interface DashboardSidebarProps {
  username: string;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  pendingCount?: number;
  onNavigate?: () => void;
}

export function DashboardSidebar({
  username,
  siteName,
  logoImage,
  logoImageAlt,
  pendingCount = 0,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const initial = username.trim().charAt(0).toUpperCase() || "م";

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col bg-card">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px]">
        <BeltDivider width="full" className="h-full border-0" />
      </div>

      <div className="shrink-0 border-b border-border px-5 pb-4 pt-5">
        <Logo siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />
        <p className="mt-2 text-[11px] font-semibold leading-4 text-muted-foreground">{DASHBOARD_LABELS.panel}</p>
      </div>

      <nav
        aria-label={DASHBOARD_LABELS.sectionLabel}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3"
      >
        <SidebarNavSection
          items={[DASHBOARD_NAV_PRIMARY]}
          pathname={pathname}
          pendingCount={pendingCount}
          onNavigate={onNavigate}
        />
        {DASHBOARD_NAV_SECTIONS.map((section) => (
          <SidebarNavSection
            key={section.label}
            label={section.label}
            items={section.items}
            pathname={pathname}
            pendingCount={pendingCount}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[12px] font-bold text-background"
          >
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold leading-5 text-foreground">{username}</p>
            <p className="flex items-center gap-1 text-[11px] font-medium leading-4 text-muted-foreground">
              <Shield className="size-3 shrink-0" aria-hidden="true" />
              {DASHBOARD_LABELS.role}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label={DASHBOARD_LABELS.viewSite}
              title={DASHBOARD_LABELS.viewSite}
              className="size-10 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}

function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label={DASHBOARD_LABELS.logout}
        title={DASHBOARD_LABELS.logout}
        className="size-10 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
