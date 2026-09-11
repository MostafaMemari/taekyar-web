import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2 ring-1 ring-border/50 sm:gap-2.5 sm:px-3.5 sm:py-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-9">
          <Icon className="!size-4 sm:!size-[18px]" />
        </span>
        <div>
          <p className="text-base font-black leading-none text-foreground sm:text-lg">
            <span dir="ltr">{value}</span>
          </p>
          <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-[11px]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
