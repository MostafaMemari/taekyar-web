"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useScrolled } from "./use-scrolled";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { NavLinkItem, isActivePath, useIsActive } from "./nav-link-item";
import { Wordmark } from "./wordmark";
import type { NavLink } from "@/data/layout/navigation";

interface NavItemView {
  id: number;
  title: string;
  href: string;
  children: NavItemView[];
}

function DesktopNavLink({ item }: { item: NavItemView }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {hasChildren ? (
        <ParentTrigger item={item} open={open} onToggle={() => setOpen((previous) => !previous)} />
      ) : (
        <DesktopNavLinkLeaf href={item.href} label={item.title} />
      )}


      {hasChildren ? (
        <div
          className={cn(
            "absolute start-0 top-full z-50 pt-3 transition-all duration-150",
            open ? "visible opacity-100" : "invisible opacity-0",
          )}
        >
          <div className="min-w-44 rounded-xl border border-border/60 bg-card p-1.5 shadow-lg shadow-black/[0.08]">
            {item.children.map((child) => (
              <NavLinkItem
                key={child.id}
                href={child.href}
                label={child.title}
                className="block rounded-lg px-3 py-2 text-[13px] transition-colors"
                activeClassName="bg-primary/[0.07] font-bold text-primary"
                inactiveClassName="text-muted-foreground hover:bg-muted hover:text-foreground"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ParentTrigger({ item, open, onToggle }: { item: NavItemView; open: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const active =
    isActivePath(item.href, pathname) || item.children.some((child) => isActivePath(child.href, pathname));

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="true"
      onClick={onToggle}
      className={cn(
        "relative -my-1 flex items-center gap-1 rounded-sm py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active ? "font-bold text-foreground" : "font-medium text-muted-foreground hover:text-foreground",
      )}
    >
      {item.title}
      <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[7px] end-0 h-[2px] rounded-full bg-primary transition-all duration-300",
          active ? "w-full opacity-100" : "w-0 opacity-0",
        )}
      />
    </button>
  );
}

function DesktopNavLinkLeaf({ href, label }: { href: string; label: string }) {
  return (
    <NavLinkItem
      href={href}
      label={label}
      className="relative -my-1 rounded-sm py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      activeClassName="font-bold text-foreground"
      inactiveClassName="font-medium text-muted-foreground hover:text-foreground"
    >
      <Underline active={useIsActive(href)} />
    </NavLinkItem>
  );
}

function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-[7px] end-0 h-[2px] rounded-full bg-primary transition-all duration-300",
        active ? "w-full opacity-100" : "w-0 opacity-0",
      )}
    />
  );
}

interface HeaderProps {
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  navItems: NavItemView[];
  mobileNavItems: NavItemView[];
}

export function Header({ siteName, logoImage, logoImageAlt, navItems, mobileNavItems }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "theme-light sticky top-0 z-40 border-b border-transparent bg-background transition-[border-color,box-shadow] duration-300",
        scrolled && "border-black/[0.07] shadow-[0_4px_16px_-12px_rgba(23,23,23,0.25)]"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:h-[68px] sm:px-6 lg:px-8">
        <Wordmark siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden flex-1 items-center gap-7 md:flex"
        >
          {navItems.map((item) => (
            <DesktopNavLink key={item.id} item={item} />
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 md:ms-0 md:gap-3">
          <Button
            variant="ghost"
            asChild
            className="hidden h-10 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            <Link href="/contact">تماس با ما</Link>
          </Button>

          <Button className="hidden h-10 gap-2 rounded-lg px-4 text-sm font-bold shadow-sm shadow-primary/25 md:inline-flex">
            <Download className="!size-4" />
            دانلود اپلیکیشن
          </Button>

          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} navItems={mobileNavItems} />
        </div>
      </div>
    </header>
  );
}

export type { NavItemView, NavLink };
