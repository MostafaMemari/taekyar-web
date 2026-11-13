"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, Download, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MOBILE_NAV_FALLBACK } from "@/data/layout/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { NavLinkItem, isActiveBranch } from "./nav-link-item";
import { Logo } from "./logo";
import type { NavItemView } from "./nav-link-item";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appDownloadUrl: string | null;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  navItems: NavItemView[];
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
        "flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-[15px] transition-colors duration-200",
        className,
      )}
      activeClassName="bg-[#E0A800]/10 font-bold text-[#a37800]"
      inactiveClassName="font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ChevronLeft className="size-4 text-muted-foreground/50" />
    </NavLinkItem>
  );
}

function MobileNavGroup({ item, onNavigate }: { item: NavItemView; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = isActiveBranch(item, pathname);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "group/collapsible flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-[15px] transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          active
            ? "bg-[#E0A800]/10 font-bold text-[#a37800]"
            : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {item.title}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            active && "text-[#a37800]",
            "group-data-open/collapsible:rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 space-y-0.5 border-s-2 border-[#E0A800]/25 ps-2">
          {item.children.map((child) =>
            child.children.length > 0 ? (
              <MobileNavGroup key={child.id} item={child} onNavigate={onNavigate} />
            ) : (
              <MobileNavLink
                key={child.id}
                href={child.href}
                label={child.title}
                onNavigate={onNavigate}
                className="text-[14px]"
              />
            ),
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MobileNavList({ items, onNavigate }: { items: NavItemView[]; onNavigate: () => void }) {
  return (
    <>
      {items.map((item) =>
        item.children.length > 0 ? (
          <MobileNavGroup key={item.id} item={item} onNavigate={onNavigate} />
        ) : (
          <MobileNavLink key={item.id} href={item.href} label={item.title} onNavigate={onNavigate} />
        ),
      )}
    </>
  );
}

export function MobileMenu({
  open,
  onOpenChange,
  appDownloadUrl,
  siteName,
  logoImage,
  logoImageAlt,
  navItems,
}: MobileMenuProps) {
  const close = () => onOpenChange(false);
  const items = navItems.length > 0 ? navItems : MOBILE_NAV_FALLBACK;
  const isDesktop = useMediaQuery("(min-width: 48rem)");

  useEffect(() => {
    if (isDesktop && open) {
      onOpenChange(false);
    }
  }, [isDesktop, open, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label="باز کردن منو"
          className="size-10 rounded-xl border border-border/70 bg-card text-foreground shadow-sm hover:bg-muted"
        >
          <Menu className="!size-[22px]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="theme-light w-[19rem] gap-0 border-none p-0 text-foreground">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="text-start">
            <Logo onNavigate={close} siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="منوی موبایل" className="flex flex-col overflow-y-auto p-3">
          <div className="flex flex-col divide-y divide-border/50 px-1">
            <MobileNavList items={items} onNavigate={close} />
          </div>
        </nav>

        <div className="mt-auto space-y-3 border-t border-border/60 p-4 pt-5">
          {appDownloadUrl ? (
            <Button
              asChild
              className="h-12 w-full gap-2 rounded-xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] text-[15px] font-extrabold text-[#2A1F00] shadow-sm shadow-[#9A6D00]/30 hover:from-[#EFAF0A] hover:via-[#D0A018] hover:to-[#A87800]"
              onClick={close}
            >
              <a href={appDownloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="!size-[18px]" />
                دانلود اپلیکیشن
              </a>
            </Button>
          ) : null}
          <Button
            variant="outline"
            asChild
            className="h-11 w-full rounded-xl border-border bg-card font-semibold"
            onClick={close}
          >
            <Link href="/contact">تماس با ما</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
