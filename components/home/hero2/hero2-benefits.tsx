import { HERO2_BENEFITS } from "@/data/home/hero2";

export function Hero2Benefits() {
  return (
    <ul className="mt-8 grid w-full max-w-md grid-cols-1 gap-x-8 gap-y-3 border-t border-border/60 pt-5 sm:grid-cols-3 lg:max-w-none">
      {HERO2_BENEFITS.map((benefit) => (
        <li
          key={benefit.title}
          className="group flex items-center gap-3 rounded-xl p-2 text-start transition-colors duration-200 hover:bg-muted/60 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-border/60 sm:[&:not(:first-child)]:ps-6"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary transition-transform duration-200 group-hover:-translate-y-0.5">
            <benefit.Icon className="size-[18px]" strokeWidth={2.25} />
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
