"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

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

interface NavigationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavigationSheet({ open, onOpenChange }: NavigationSheetProps) {
  const closeMenu = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label="باز کردن منو">
          <Menu className="!size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="theme-light w-72 gap-0 border-border p-0">
        <SheetHeader className="border-b border-border py-5">
          <SheetTitle className="text-lg font-black">تک‌یار</SheetTitle>
        </SheetHeader>
        <nav aria-label="منوی موبایل" className="flex flex-col p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-md px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-4 p-4 pb-6">
          <Button className="h-11 w-full rounded-lg font-semibold" onClick={closeMenu}>
            دانلود اپلیکیشن
          </Button>
          <BeltDivider fullWidth />
        </div>
      </SheetContent>
    </Sheet>
  );
}
