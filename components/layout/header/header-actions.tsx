"use client";

import type { ReactNode } from "react";

import { DownloadAppButton } from "./download-app-button";
import { MobileMenu } from "./mobile-menu";
import type { NavItemView } from "./nav-link-item";

interface HeaderActionsProps {
  appDownloadUrl: string | null;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
  mobileNavItems: NavItemView[];
  children?: ReactNode;
}

export function HeaderActions({
  appDownloadUrl,
  menuOpen,
  onMenuOpenChange,
  siteName,
  logoImage,
  logoImageAlt,
  mobileNavItems,
  children,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-1.5 max-md:col-start-1 max-md:row-start-1 md:gap-3">
      {children}
      {appDownloadUrl ? <DownloadAppButton href={appDownloadUrl} /> : null}
      <MobileMenu
        open={menuOpen}
        onOpenChange={onMenuOpenChange}
        appDownloadUrl={appDownloadUrl}
        siteName={siteName}
        logoImage={logoImage}
        logoImageAlt={logoImageAlt}
        navItems={mobileNavItems}
      />
    </div>
  );
}
