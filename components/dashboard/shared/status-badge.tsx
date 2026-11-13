import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone = "draft" | "published" | "pending" | "approved" | "rejected" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  draft: "border-warning/25 bg-warning-subtle text-warning",
  published: "border-success/25 bg-success-subtle text-success",
  pending: "border-warning/25 bg-warning-subtle text-warning",
  approved: "border-success/25 bg-success-subtle text-success",
  rejected: "border-destructive/25 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-muted-foreground",
};

const COMMENT_STATUS_TONES: Record<string, StatusTone> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const CONTENT_STATUS_TONES: Record<string, StatusTone> = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export function resolveCommentTone(status: string): StatusTone {
  return COMMENT_STATUS_TONES[status] ?? "neutral";
}

export function resolveContentTone(status: string): StatusTone {
  return CONTENT_STATUS_TONES[status] ?? "neutral";
}

interface StatusBadgeProps {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-4",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </Badge>
  );
}
