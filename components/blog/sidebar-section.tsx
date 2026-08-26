import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, icon: Icon, children, className }: SidebarSectionProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "overflow-hidden rounded-2xl bg-card shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2.5 sm:px-4">
        <Icon className="size-3.5 sm:size-4 text-primary" />
        <h2 className="text-[11px] font-bold text-foreground sm:text-xs">{title}</h2>
      </div>
      <div className="p-1.5 sm:p-2">{children}</div>
    </section>
  );
}
