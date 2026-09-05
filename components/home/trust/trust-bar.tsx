import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TRUST_STATS } from "@/data/home/trust";

export function TrustBar() {
  return (
    <Section containerClassName="py-2">
      <Reveal>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-5 border-y border-border/50 py-6 sm:gap-x-2">
          {TRUST_STATS.map(({ value, label, Icon }) => (
            <li
              key={label}
              className="group flex items-center gap-3 px-4 sm:px-8 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-border/50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] text-primary transition-transform duration-200 group-hover:-translate-y-0.5">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 text-start">
                <span className="block text-[22px] font-black leading-none tabular-nums text-foreground">
                  {value}
                </span>
                <span className="mt-1.5 block text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
