"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { Logo } from "@/components/layout/header/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";

interface DashboardMobileNavProps {
  username: string;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
}

export function DashboardMobileNav({ username, siteName, logoImage, logoImageAlt }: DashboardMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between gap-3 border-b border-border/60 bg-card px-4 lg:hidden">
      <div className="shrink-0">
        <Logo siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="باز کردن منو"
            aria-expanded={open}
            className="shrink-0"
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[300px] bg-card p-0 sm:w-[320px]"
          aria-label={DASHBOARD_LABELS.sectionLabel}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{DASHBOARD_LABELS.panel}</SheetTitle>
          </SheetHeader>

          <div className="flex h-full flex-col" onClick={() => setOpen(false)}>
            <DashboardSidebar username={username} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
