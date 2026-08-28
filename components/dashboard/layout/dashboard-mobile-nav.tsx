"use client";

import { useState } from "react";
import Link from "next/link";

import { Menu } from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";

export function DashboardMobileNav({ username }: { username: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between gap-3 border-b border-border/60 bg-card px-4 lg:hidden">
      <Link
        href="/dashboard"
        aria-label={DASHBOARD_LABELS.panel}
        className="group/mark flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-lg bg-primary text-base font-black leading-none text-white shadow-sm shadow-primary/30 transition-transform duration-300 group-hover/mark:-rotate-3"
        >
          ت
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-black tracking-tight text-foreground">تک‌یار</span>
          <span lang="ko" aria-hidden="true" className="mt-[3px] text-[9px] font-bold tracking-[0.22em] text-muted-foreground">
            태권도
          </span>
        </span>
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
