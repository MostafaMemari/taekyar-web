"use client";

import Link from "next/link";
import { Download, Menu } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/data";
import { Wordmark } from "./wordmark";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="باز کردن منو">
          <Menu className="!size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="theme-light w-72 gap-0 border-border p-0">
        <SheetHeader className="border-b border-border py-5">
          <SheetTitle className="text-start text-lg font-black">
            <Wordmark onNavigate={close} />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="منوی موبایل" className="flex flex-col p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-4 p-4 pb-6">
          <Button className="h-11 w-full gap-2 rounded-xl font-semibold" onClick={close}>
            <Download className="!size-4" />
            دانلود اپلیکیشن
          </Button>
          <BeltDivider fullWidth />
        </div>
      </SheetContent>
    </Sheet>
  );
}
