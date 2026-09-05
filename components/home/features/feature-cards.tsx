import { cn } from "@/lib/utils";
import type { HomeFeature } from "@/data/home/features";

export function FeatureCard({ Icon, tint, title, description }: HomeFeature) {
  return (
    <article className="border-t border-border/60 pt-5">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tint)}>
        <Icon className="!size-5" />
      </span>
      <h3 className="mt-4 text-base font-bold leading-6">{title}</h3>
      <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{description}</p>
    </article>
  );
}
