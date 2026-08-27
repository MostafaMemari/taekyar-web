"use client";

import { useReadingProgress } from "@/hooks/use-reading-progress";
import { cn } from "@/lib/utils";

const BELT_FILL_COLORS = [
  "bg-belt-yellow",
  "bg-belt-green",
  "bg-belt-blue",
  "bg-belt-red",
  "bg-belt-black",
] as const;

export function ReadingProgress() {
  const fraction = useReadingProgress();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-black/[0.08] transition-opacity duration-300 motion-reduce:transition-none"
      style={{ opacity: fraction > 0.005 ? 1 : 0 }}
    >
      <div className="flex h-full">
        {BELT_FILL_COLORS.map((color, index) => {
          const fill = Math.min(1, Math.max(0, fraction * BELT_FILL_COLORS.length - index));
          return (
            <div key={color} className="h-full flex-1 overflow-hidden">
              <div
                className={cn("h-full transition-[width] duration-150 ease-out motion-reduce:transition-none", color)}
                style={{ width: `${fill * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
