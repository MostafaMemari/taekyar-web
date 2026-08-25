"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-md text-xl font-black text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex items-center gap-1.5">
        تک‌یار
        <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-primary" />
      </span>
      <span
        lang="ko"
        aria-hidden="true"
        className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-[0.2em] text-muted-foreground sm:inline-block"
      >
        태권도
      </span>
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

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

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="باز کردن منو">
                <Menu className="!size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="theme-light w-72 gap-0 border-border p-0">
              <SheetHeader className="border-b border-border py-5">
                <SheetTitle className="text-start text-lg font-black">
                  <Wordmark onNavigate={closeMenu} />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="منوی موبایل" className="flex flex-col p-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-4 p-4 pb-6">
                <Button
                  className="h-11 w-full gap-2 rounded-xl font-semibold"
                  onClick={closeMenu}
                >
                  <Download className="!size-4" />
                  دانلود اپلیکیشن
                </Button>
                <BeltDivider fullWidth />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
