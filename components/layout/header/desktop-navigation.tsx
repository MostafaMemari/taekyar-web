"use client";

import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavLinkItem, isActiveBranch, useIsActive, type NavItemView } from "./nav-link-item";

function DesktopNavLink({ item }: { item: NavItemView }) {
  if (item.children.length > 0) {
    return <DesktopNavDropdown item={item} />;
  }
  return <DesktopNavLinkLeaf href={item.href} label={item.title} />;
}

function DesktopNavLinkLeaf({ href, label }: { href: string; label: string }) {
  return (
    <NavigationMenuLink asChild>
      <NavLinkItem
        href={href}
        label={label}
        className="-my-1 rounded-md px-2.5 py-1 text-sm transition-colors duration-200"
        activeClassName="bg-muted font-bold text-foreground"
        inactiveClassName="font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      />
    </NavigationMenuLink>
  );
}

function NavChildLink({ href, label }: { href: string; label: string }) {
  const active = useIsActive(href);

  return (
    <NavigationMenuLink asChild>
      <NavLinkItem
        href={href}
        label={label}
        className="group/item flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors duration-200"
        activeClassName="bg-primary/[0.07] font-bold text-primary"
        inactiveClassName="text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <ChevronLeft
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-all duration-200",
            active
              ? "text-primary opacity-70"
              : "translate-x-1 opacity-0 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-60 group-hover/item:translate-x-0 group-hover/item:opacity-60"
          )}
        />
      </NavLinkItem>
    </NavigationMenuLink>
  );
}

function NavChildrenList({ items }: { items: NavItemView[] }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((child) => (
        <li key={child.id}>
          <NavChildLink href={child.href} label={child.title} />
          {child.children.length > 0 ? (
            <div className="mt-0.5 space-y-0.5 border-s-2 border-primary/20 ps-2">
              <NavChildrenList items={child.children} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function DesktopNavDropdown({ item }: { item: NavItemView }) {
  const pathname = usePathname();
  const active = isActiveBranch(item, pathname);

  return (
    <>
      <NavigationMenuTrigger
        className={cn(
          "-my-1 rounded-md px-2.5 py-1 text-sm transition-colors duration-200 data-open:bg-muted/70",
          active
            ? "bg-muted font-bold text-foreground"
            : "font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )}
      >
        {item.title}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-48">
        <NavChildrenList items={item.children} />
      </NavigationMenuContent>
    </>
  );
}

export function DesktopNavigation({ items }: { items: NavItemView[] }) {
  return (
    <NavigationMenu
      dir="rtl"
      aria-label="ناوبری اصلی"
      delayDuration={0}
      className="hidden max-w-none flex-1 md:flex"
    >
      <NavigationMenuList className="justify-center gap-7">
        {items.map((item) => (
          <NavigationMenuItem key={item.id}>
            <DesktopNavLink item={item} />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
