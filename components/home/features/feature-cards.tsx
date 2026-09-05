import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { HomeFeature } from "@/data/home/features";

export function FeatureCard({ Icon, tint, title, description, progress }: HomeFeature) {
  return (
    <article
      className={cn(SURFACE_CARD, SURFACE_CARD_INTERACTIVE, "flex h-full flex-col p-5 sm:p-6")}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tint)}>
        <Icon className="!size-5" />
      </span>
      <h3 className="mt-4 text-base font-bold leading-6">{title}</h3>
      <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{description}</p>
      {progress ? (
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">{progress.label}</span>
            <span className="text-primary">{progress.value}٪</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress.value}%` }} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
