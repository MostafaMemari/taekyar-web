import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { TRUST_STATS } from "@/data/home/trust";

export function TrustBar() {
  return (
    <Section containerClassName="py-2">
      <Reveal>
        <dl className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 border-y border-border/50 py-6 sm:gap-x-2">
          {TRUST_STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 text-center sm:px-8 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-border/50"
            >
              <dt className="order-1 text-[13px] font-medium text-muted-foreground">
                {label}
              </dt>
              <dd className="text-2xl font-black tabular-nums text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
