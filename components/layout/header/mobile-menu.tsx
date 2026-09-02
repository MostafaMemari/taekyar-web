"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, Download, Menu } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MOBILE_NAV_FALLBACK } from "@/data/layout/navigation";
import { cn } from "@/lib/utils";
import { NavLinkItem, isActivePath } from "./nav-link-item";
import { Wordmark } from "./wordmark";
import type { NavItemView } from "./header";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  navItems: NavItemView[];
}

function MobileNavGroup({ item, onNavigate }: { item: NavItemView; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active =
    isActivePath(item.href, pathname) || item.children.some((child) => isActivePath(child.href, pathname));

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-3 text-[15px] transition-colors",
          active ? "bg-primary/[0.07] font-bold text-primary" : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {item.title}
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="mt-0.5 space-y-0.5 border-s-2 border-primary/20 ps-2">
          <MobileNavLink
            href={item.href}
            label={item.title}
            onNavigate={onNavigate}
            className="text-[14px]"
          />
          {item.children.map((child) => (
            <MobileNavLink
              key={child.id}
              href={child.href}
              label={child.title}
              onNavigate={onNavigate}
              className="text-[14px]"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileNavLink({
  href,
  label,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <NavLinkItem
      href={href}
      label={label}
      onNavigate={onNavigate}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-3 text-[15px] transition-colors",
        className,
      )}
      activeClassName="bg-primary/[0.07] font-bold text-primary"
      inactiveClassName="font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ChevronLeft className="size-4 text-muted-foreground/50" />
    </NavLinkItem>
  );
}

export function MobileMenu({ open, onOpenChange, siteName, logoImage, logoImageAlt, navItems }: MobileMenuProps) {
  const close = () => onOpenChange(false);
  const items = navItems.length > 0 ? navItems : MOBILE_NAV_FALLBACK;

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
      <SheetContent side="right" className="theme-light w-[19rem] gap-0 border-none p-0 text-foreground">
        <SheetHeader className="border-b border-black/[0.07] px-5 py-4">
          <SheetTitle className="text-start">
            <Wordmark onNavigate={close} siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="منوی موبایل" className="flex flex-col gap-0.5 p-3">
          {items.map((item) =>
            item.children.length > 0 ? (
              <MobileNavGroup key={item.id} item={item} onNavigate={close} />
            ) : (
              <MobileNavLink key={item.id} href={item.href} label={item.title} onNavigate={close} />
            ),
          )}
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
          <BeltDivider width="full" className="mt-4" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
