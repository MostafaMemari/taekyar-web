import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { BELT_PATH, CURRENT_BELT_INDEX } from "./data";
import { BeltIcon } from "./belt-icon";

const CELL_BASE =
  "flex flex-col items-center gap-2.5 rounded-xl border border-transparent px-2 py-4 text-center transition-colors";

export function BeltPath() {
  return (
    <div className={cn(SURFACE_CARD, "px-5 py-6 sm:px-7")}>
      <h3 className="text-sm font-extrabold">مسیر کمربند تو</h3>

      <ol className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-6">
        {BELT_PATH.map(({ name, color }, index) => {
          const current = index === CURRENT_BELT_INDEX;
          const isNext = index === CURRENT_BELT_INDEX + 1;
          const earned = index <= CURRENT_BELT_INDEX;

          return (
            <li
              key={name}
              className={cn(
                CELL_BASE,
                current && "border-primary/60 bg-card shadow-sm",
                !current && earned && "border-transparent bg-[#fafaf8] ring-1 ring-black/[0.04]",
                isNext && "border-dashed border-primary/40 bg-transparent",
                !earned && !isNext && "border-transparent bg-transparent"
              )}
            >
              <BeltIcon
                color={color}
                state={
                  earned ? "earned" : isNext ? "next" : "locked"
                }
                className="w-full max-w-16"
              />
              <span
                className={cn(
                  "text-[11px] leading-none",
                  current
                    ? "font-bold text-foreground"
                    : earned || isNext
                      ? "font-medium text-foreground/70"
                      : "font-medium text-muted-foreground/60"
                )}
              >
                {name}
              </span>
              {current ? (
                <span
                  aria-hidden="true"
                  className="h-0.5 w-4 rounded-full bg-primary"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
