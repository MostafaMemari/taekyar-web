import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

interface SidebarSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, icon: Icon, children, className }: SidebarSectionProps) {
  return (
    <Card asChild className="p-0 gap-0" aria-label={title}>
      <section className={className}>
        <div className="flex items-center gap-2.5 border-b border-border/60 bg-muted/20 px-3.5 py-2.5 sm:px-4">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          <h2 className="text-[12px] font-black text-foreground sm:text-[13px]">{title}</h2>
        </div>
        <div className="p-2 sm:p-2.5">{children}</div>
      </section>
    </Card>
  );
}
