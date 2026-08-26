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
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
        <Icon className="size-4 text-primary" />
        <h2 className="text-xs font-bold text-foreground">{title}</h2>
      </div>
      <div className="p-2.5">{children}</div>
    </section>
  );
}
