import Link from "next/link";

import { ForwardIcon } from "@/components/dashboard/shared/directional-icons";
import { Card } from "@/components/ui/card";
import type { DashboardNavIcon } from "@/data/dashboard/navigation";
import { cn, toFaDigits } from "@/lib/utils";

export type StatTone = "neutral" | "brand" | "warning" | "success" | "info";

const TONE_ICON_CLASSES: Record<StatTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/10 text-primary",
  warning: "bg-warning-subtle text-warning",
  success: "bg-success-subtle text-success",
  info: "bg-info-subtle text-info",
};

interface StatCardProps {
  label: string;
  value: number;
  Icon: DashboardNavIcon;
  tone?: StatTone;
  hint?: string;
  href?: string;
}

export function StatCard({ label, value, Icon, tone = "neutral", hint, href }: StatCardProps) {
  const body = (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TONE_ICON_CLASSES[tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        {href ? <ForwardIcon className="size-4 shrink-0 text-muted-foreground/70" aria-hidden="true" /> : null}
      </span>
      <span className="mt-3 block text-2xl font-bold leading-none tabular-nums text-foreground">{toFaDigits(value)}</span>
      <span className="mt-2 block text-[13px] font-medium leading-5 text-muted-foreground">{label}</span>
      {hint ? <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{hint}</span> : null}
    </>
  );

  const cardClassName = cn(
    "rounded-xl p-0 shadow-none",
    href && "transition-colors hover:border-primary/40 motion-reduce:transition-none",
  );

  if (href) {
    return (
      <Card asChild size="sm" className={cardClassName}>
        <Link
          href={href}
          className="block gap-0 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {body}
        </Link>
      </Card>
    );
  }

  return (
    <Card size="sm" className={cardClassName}>
      <div className="flex flex-col p-4">{body}</div>
    </Card>
  );
}
