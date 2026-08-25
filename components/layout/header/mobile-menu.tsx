"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Download, Menu } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Wordmark } from "./wordmark";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="باز کردن منو"
          className="size-10 rounded-lg text-foreground"
        >
          <Menu className="!size-[22px]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="theme-light w-[19rem] gap-0 border-none p-0">
        <SheetHeader className="border-b border-black/[0.07] px-5 py-4">
          <SheetTitle className="text-start">
            <Wordmark onNavigate={close} />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="منوی موبایل" className="flex flex-col gap-0.5 p-3">
          {navLinks.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-3 text-[15px] transition-colors",
                  active
                    ? "bg-primary/[0.07] font-bold text-primary"
                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
                <ChevronLeft
                  className={cn("size-4", active ? "text-primary" : "text-muted-foreground/50")}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 p-4 pb-6">
          <Button
            className="h-12 w-full gap-2 rounded-lg text-[15px] font-bold shadow-sm shadow-primary/25"
            onClick={close}
          >
            <Download className="!size-[18px]" />
            دانلود اپلیکیشن
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-11 w-full rounded-lg bg-card font-semibold"
            onClick={close}
          >
            <Link href="/contact">تماس با ما</Link>
          </Button>
          <BeltDivider fullWidth className="mt-4" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
