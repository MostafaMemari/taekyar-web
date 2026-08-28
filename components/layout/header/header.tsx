"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/data/layout/navigation";
import { useScrolled } from "./use-scrolled";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { NavLinkItem, useIsActive } from "./nav-link-item";
import { Wordmark } from "./wordmark";

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  const active = useIsActive(href);

  return (
    <NavLinkItem
      href={href}
      label={label}
      className="relative -my-1 rounded-sm py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      activeClassName="font-bold text-foreground"
      inactiveClassName="font-medium text-muted-foreground hover:text-foreground"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[7px] end-0 h-[2px] rounded-full bg-primary transition-all duration-300",
          active ? "w-full opacity-100" : "w-0 opacity-0"
        )}
      />
    </NavLinkItem>
  );
}

export function Header() {
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
        <Wordmark />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden flex-1 items-center gap-7 md:flex"
        >
          {navLinks.map(({ href, label }) => (
            <DesktopNavLink key={href} href={href} label={label} />
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

          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </div>
    </header>
  );
}
