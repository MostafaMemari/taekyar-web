import { HERO2_BENEFITS } from "@/data/home/hero2";

export function Hero2Benefits() {
  return (
    <ul className="mt-9 grid w-full max-w-md grid-cols-1 gap-x-8 gap-y-3 border-t border-border/60 pt-6 sm:grid-cols-3 lg:max-w-none">
      {HERO2_BENEFITS.map((benefit) => (
        <li
          key={benefit.title}
          className="flex items-center gap-2.5 text-start"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <benefit.Icon className="size-4" strokeWidth={2.25} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-bold text-foreground">
              {benefit.title}
            </span>
            <span className="block text-[11px] leading-4 text-muted-foreground">
              {benefit.description}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
