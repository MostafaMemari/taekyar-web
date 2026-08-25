import type { Feature } from "./data";

const CARD_BASE =
  "h-full rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.07] sm:p-6";

export function FeatureCard({ Icon, tint, title, description }: Feature) {
  return (
    <article className={CARD_BASE}>
      <span className={`flex size-11 items-center justify-center rounded-full ${tint}`}>
        <Icon className="!size-5" />
      </span>
      <h3 className="mt-3.5 text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm font-normal leading-7 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}
