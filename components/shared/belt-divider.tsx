import { cn } from "@/lib/utils";

const BELT_ORDER = [
  "bg-belt-white",
  "bg-belt-yellow",
  "bg-belt-green",
  "bg-belt-blue",
  "bg-belt-red",
  "bg-belt-black",
] as const;

interface BeltDividerProps {
  fullWidth?: boolean;
  className?: string;
  variant?: "strip" | "pill" | "slant";
}

export function BeltDivider({
  fullWidth = true,
  className,
  variant = "strip",
}: BeltDividerProps) {
  const segments = BELT_ORDER.map((color) => (
    <div key={color} className={cn("h-full flex-1", color)} />
  ));

  if (variant === "pill") {
    return (
      <div
        aria-hidden="true"
        className={cn("h-1.5 w-24 overflow-hidden rounded-full", className)}
      >
        <div className="flex h-full">{segments}</div>
      </div>
    );
  }

  if (variant === "slant") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "h-3 w-full overflow-hidden",
          !fullWidth && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          className
        )}
      >
        <div className="flex h-full items-stretch gap-2 [&>div]:-skew-x-12">
          {segments}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-[5px] w-full overflow-hidden border-y border-foreground/10",
        !fullWidth && "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="flex h-full">{segments}</div>
    </div>
  );
}
