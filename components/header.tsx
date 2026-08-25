"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground"
    >
      <span className="flex items-center gap-1.5">
        تک‌یار
        <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-primary" />
      </span>
      <span
        lang="ko"
        aria-hidden="true"
        className="hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-[0.2em] text-muted-foreground sm:inline-block"
      >
        태권도
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden items-center gap-7 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden rounded-lg px-4 font-semibold md:inline-flex">
            دانلود اپلیکیشن
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="باز کردن منو">
                <Menu className="!size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0 border-border p-0">
              <SheetHeader className="border-b border-border py-5">
                <SheetTitle className="text-lg font-black">تک‌یار</SheetTitle>
              </SheetHeader>
              <nav aria-label="منوی موبایل" className="flex flex-col p-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-3 text-[15px] font-medium",
                      "text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-4 p-4 pb-6">
                <Button
                  className="h-11 w-full rounded-lg font-semibold"
                  onClick={() => setOpen(false)}
                >
                  دانلود اپلیکیشن
                </Button>
                <BeltDivider fullWidth />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="border-b border-border" />
    </header>
  );
}
