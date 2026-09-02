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
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center px-4 sm:h-[68px] md:flex md:gap-8 md:px-6 lg:px-8">
        <div className="max-md:col-start-2 max-md:row-start-1 max-md:justify-self-center">
          <Wordmark siteName={siteName} logoImage={logoImage} logoImageAlt={logoImageAlt} />
        </div>

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
