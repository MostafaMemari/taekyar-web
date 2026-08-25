"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onNavigate?: () => void;
  children?: React.ReactNode;
}

function isHomeHref(href: string) {
  return href === "/";
}

export function useIsActive(href: string) {
  const pathname = usePathname();
  return isHomeHref(href) ? pathname === "/" : pathname.startsWith(href);
}

export function NavLinkItem({
  href,
  label,
  className,
  activeClassName,
  inactiveClassName,
  onNavigate,
  children,
}: NavItemProps) {
  const active = useIsActive(href);

  const handleClick = () => {
    if (isHomeHref(href) && window.location.pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    onNavigate?.();
  };

  return (
    <Link
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
