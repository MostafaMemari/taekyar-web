import { Check } from "lucide-react";

import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { BELT_PATH, CURRENT_BELT_INDEX } from "./data";

const LIGHT_BELTS = ["سفید", "زرد"];

export function BeltPath() {
  return (
    <div className={cn(SURFACE_CARD, "p-5 sm:p-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-extrabold">مسیر کمربند تو</p>
        <p className="text-xs font-medium text-muted-foreground">
          الان: کمربند سبز · قدم بعدی: آبی
        </p>
      </div>

      <ol className="mt-5 flex items-center gap-1.5 sm:gap-3">
        {BELT_PATH.map(({ name, color }, index) => {
          const reached = index <= CURRENT_BELT_INDEX;
          const isLast = index === BELT_PATH.length - 1;

          return (
            <li key={name} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center gap-1.5 sm:gap-2">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-black/10 sm:size-7",
                    !reached && "opacity-35"
                  )}
                  style={{ backgroundColor: color }}
                >
                  {reached ? (
                    <Check
                      className={cn(
                        "size-3",
                        LIGHT_BELTS.includes(name) ? "text-black/70" : "text-white"
                      )}
                      strokeWidth={3}
                    />
                  ) : null}
                </span>
                {!isLast ? (
                  <span
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      index < CURRENT_BELT_INDEX
                        ? "bg-primary/70"
                        : "bg-foreground/[0.08]"
                    )}
                  />
                ) : null}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium sm:text-[11px]",
                  reached ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
