"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { useScrolled } from "@/lib/use-scrolled";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { Wordmark } from "./wordmark";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "theme-light sticky top-0 z-40 bg-background/80 backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_rgba(23,23,23,0.06),0_8px_24px_-16px_rgba(23,23,23,0.18)]"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <Button className="hidden h-10 gap-2 rounded-xl px-4 font-semibold shadow-sm shadow-primary/20 md:inline-flex">
            <Download className="!size-4" />
            دانلود اپلیکیشن
          </Button>

          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </div>
    </header>
  );
}
