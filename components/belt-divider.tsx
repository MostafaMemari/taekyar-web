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
}

export function BeltDivider({ fullWidth = true, className }: BeltDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-[5px] w-full overflow-hidden border-y border-foreground/10",
        !fullWidth && "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="flex h-full">
        {BELT_ORDER.map((color) => (
          <div key={color} className={cn("h-full flex-1", color)} />
        ))}
      </div>
    </div>
  );
}
