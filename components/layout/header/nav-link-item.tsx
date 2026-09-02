"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  label: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onNavigate?: () => void;
}

export interface NavItemView {
  id: number;
  title: string;
  href: string;
  children: NavItemView[];
}

function isHomeHref(href: string) {
  return href === "/";
}

export function isActivePath(href: string, pathname: string): boolean {
  return isHomeHref(href) ? pathname === "/" : pathname.startsWith(href);
}

export function useIsActive(href: string) {
  const pathname = usePathname();
  return isActivePath(href, pathname);
}

export function NavLinkItem({
  href,
  label,
  className,
  activeClassName,
  inactiveClassName,
  onNavigate,
  children,
  onClick,
  ref,
  ...props
}: NavItemProps) {
  const active = useIsActive(href);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomeHref(href) && window.location.pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    onNavigate?.();
    onClick?.(event);
  };

  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      onClick={handleClick}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
    >
      {label}
      {children}
    </Link>
  );
}
