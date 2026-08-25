"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { NavigationSheet } from "./navigation-sheet";
import { Wordmark } from "./wordmark";

function DesktopNav() {
  return (
    <nav aria-label="ناوبری اصلی" className="hidden items-center gap-7 md:flex">
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
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="theme-light sticky top-0 z-40 border-b border-black/[0.06] bg-card/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <DesktopNav />

        <div className="flex items-center gap-2">
          <Button className="hidden rounded-lg px-4 font-semibold md:inline-flex">
            دانلود اپلیکیشن
          </Button>

          <NavigationSheet open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </div>
    </header>
  );
}
