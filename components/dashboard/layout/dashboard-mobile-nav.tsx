"use client";

import { useState } from "react";
import Link from "next/link";

import { Menu } from "lucide-react";

import { Wordmark } from "@/components/layout/header/wordmark";
import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";

export function DashboardMobileNav({ username }: { username: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between gap-3 border-b border-border/60 bg-card px-4 lg:hidden">
      <Link href="/dashboard" aria-label={DASHBOARD_LABELS.panel} className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-md">
        <Wordmark />
      </Link>

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
