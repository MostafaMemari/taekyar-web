"use client";

import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavLinkItem, isActivePath, useIsActive, type NavItemView } from "./nav-link-item";

function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-[7px] end-0 h-[2px] rounded-full bg-primary transition-all duration-300",
        active ? "w-full opacity-100" : "w-0 opacity-0"
      )}
    />
  );
}

function isActiveBranch(item: NavItemView, pathname: string): boolean {
  return (
    isActivePath(item.href, pathname) ||
    item.children.some((child) => isActiveBranch(child, pathname))
  );
}

function DesktopNavLink({ item }: { item: NavItemView }) {
  if (item.children.length > 0) {
    return <DesktopNavDropdown item={item} />;
  }
  return <DesktopNavLinkLeaf href={item.href} label={item.title} />;
}

function DesktopNavLinkLeaf({ href, label }: { href: string; label: string }) {
  const active = useIsActive(href);

  return (
    <NavigationMenuLink asChild>
      <NavLinkItem
        href={href}
        label={label}
        className="relative -my-1 rounded-sm py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        activeClassName="font-bold text-foreground"
        inactiveClassName="font-medium text-muted-foreground hover:text-foreground"
      >
        <Underline active={active} />
      </NavLinkItem>
    </NavigationMenuLink>
  );
}

function NavChildrenList({ items }: { items: NavItemView[] }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((child) => (
        <li key={child.id}>
          <NavigationMenuLink asChild>
            <NavLinkItem
              href={child.href}
              label={child.title}
              className="rounded-lg px-3 py-2 text-[13px] transition-colors"
              activeClassName="bg-primary/[0.07] font-bold text-primary"
              inactiveClassName="text-muted-foreground hover:bg-muted hover:text-foreground"
            />
          </NavigationMenuLink>
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
          "relative -my-1 rounded-sm py-1 text-sm transition-colors",
          active
            ? "font-bold text-foreground"
            : "font-medium text-muted-foreground hover:text-foreground"
        )}
      >
        {item.title}
        <Underline active={active} />
      </NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-44 rounded-xl p-1.5">
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
