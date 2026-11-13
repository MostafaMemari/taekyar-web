import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  icon: LucideIcon;
  label?: string;
  className?: string;
  iconClassName?: string;
}

export function ImagePlaceholder({ icon: Icon, label, className, iconClassName }: ImagePlaceholderProps) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden bg-primary/[0.05] ring-1 ring-inset ring-primary/15",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn("size-8 text-primary/45 transition-transform duration-500", iconClassName)}
      />
    </div>
  );
}
