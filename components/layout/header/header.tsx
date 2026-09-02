"use client";

import { useState } from "react";

import { useScrolled } from "./use-scrolled";
import { cn } from "@/lib/utils";
import { DesktopNavigation } from "./desktop-navigation";
import { HeaderActions } from "./header-actions";
import { Wordmark } from "./wordmark";
import type { NavItemView } from "./nav-link-item";

interface HeaderProps {
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  appDownloadUrl?: string | null;
  navItems: NavItemView[];
  mobileNavItems: NavItemView[];
}

export function Header({
  siteName,
  logoImage,
  logoImageAlt,
  appDownloadUrl,
  navItems,
  mobileNavItems,
}: HeaderProps) {
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

        <DesktopNavigation items={navItems} />

        <HeaderActions
          appDownloadUrl={appDownloadUrl ?? null}
          menuOpen={menuOpen}
          onMenuOpenChange={setMenuOpen}
          siteName={siteName}
          logoImage={logoImage}
          logoImageAlt={logoImageAlt}
          mobileNavItems={mobileNavItems}
        />
      </div>
    </header>
  );
}

export type { NavItemView };
