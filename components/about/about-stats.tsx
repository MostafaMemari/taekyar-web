import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { ABOUT_STATS } from "@/data/about";

export function AboutStats() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
      {ABOUT_STATS.map((stat) => (
        <li
          key={stat.label}
          className={cn(SURFACE_CARD, "flex flex-col items-center gap-1 px-4 py-5 text-center sm:py-6")}
        >
          <span className="text-xl font-black tabular-nums text-primary sm:text-2xl">{stat.value}</span>
          <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
