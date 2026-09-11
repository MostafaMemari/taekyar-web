"use client";

import Link from "next/link";
import { ChevronDown, ExternalLink, LogOut, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";
import { logout } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

interface DashboardUserMenuProps {
  username: string;
  className?: string;
}

export function DashboardUserMenu({ username, className }: DashboardUserMenuProps) {
  const initial = username.trim().charAt(0).toUpperCase() || "م";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-10 gap-2 rounded-lg px-2 text-[13px] font-medium text-foreground hover:bg-muted",
            className,
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background"
          >
            {initial}
          </span>
          <span className="hidden max-w-32 truncate sm:inline">{username}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="theme-admin w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate">{username}</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Shield className="size-3 shrink-0" aria-hidden="true" />
            {DASHBOARD_LABELS.role}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/">
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
            {DASHBOARD_LABELS.viewSite}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <form action={logout}>
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="w-full">
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
              {DASHBOARD_LABELS.logout}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
