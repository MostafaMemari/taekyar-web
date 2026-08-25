import { Check } from "lucide-react";

import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { FEATURED_FEATURE, PLAN_CHIPS, type SupportingFeature } from "./data";
import { WeeklyPlanPreview } from "./weekly-plan-preview";

export function FeaturedFeatureCard() {
  const { Icon, title, description } = FEATURED_FEATURE;

  return (
    <article className={cn(SURFACE_CARD, "overflow-hidden")}>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:p-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            <Icon className="size-3.5" />
            قلب تک‌یار
          </span>
          <h3 className="mt-4 text-2xl font-extrabold leading-[1.35] sm:text-3xl sm:leading-[1.3]">
            {title}
          </h3>
          <p className="mt-3 max-w-md text-[15px] leading-8 text-muted-foreground">
            {description}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {PLAN_CHIPS.map((chip) => (
              <li
                key={chip}
                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
              >
                <Check className="size-3 text-belt-green" strokeWidth={3} />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <WeeklyPlanPreview />
      </div>
    </article>
  );
}

export function FeatureCard({ Icon, tint, title, description }: SupportingFeature) {
  return (
    <article
      className={cn(SURFACE_CARD, SURFACE_CARD_INTERACTIVE, "h-full p-5 sm:p-6")}
    >
      <div className="flex items-center gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tint)}>
          <Icon className="!size-[18px]" />
        </span>
        <h3 className="text-base font-bold leading-6">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}
