"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, Download, Menu } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
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
        "flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-[15px] transition-colors duration-200",
        className,
      )}
      activeClassName="bg-primary/[0.07] font-bold text-primary"
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
          "group/collapsible flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-[15px] transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          active
            ? "bg-primary/[0.07] font-bold text-primary"
            : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {item.title}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            active && "text-primary",
            "group-data-open/collapsible:rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 space-y-0.5 border-s-2 border-primary/20 ps-2">
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
          className="size-10 rounded-lg text-foreground hover:bg-muted"
        >
          <Menu className="!size-[22px]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="theme-light w-[19rem] gap-0 border-none p-0 text-foreground">
        <SheetHeader className="border-b border-black/[0.07] px-5 py-4">
          <SheetTitle className="text-start">
            <Logo onNavigate={close} siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="منوی موبایل" className="flex flex-col gap-0.5 overflow-y-auto p-3">
          <MobileNavList items={items} onNavigate={close} />
        </nav>

        <div className="mt-auto space-y-3 p-4 pb-6">
          {appDownloadUrl ? (
            <Button
              asChild
              className="h-12 w-full gap-2 rounded-lg text-[15px] font-bold shadow-sm shadow-primary/25"
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
