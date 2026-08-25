import { Dumbbell } from "lucide-react";

interface StatCardProps {
  icon: typeof Dumbbell;
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5 rounded-2xl bg-card px-3.5 py-2.5 shadow-xl shadow-black/10 ring-1 ring-black/5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="!size-[18px]" />
        </span>
        <div>
          <p className="text-lg font-black leading-none text-foreground">
            <span dir="ltr">{value}</span>
          </p>
          <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
