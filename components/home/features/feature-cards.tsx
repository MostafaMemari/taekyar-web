import { cn } from "@/lib/utils";
import type { HomeFeature } from "@/data/home/features";

export function FeatureSupportItem({ Icon, tint, title, description }: HomeFeature) {
  return (
    <li className="group rounded-xl px-2 py-4 transition-colors duration-200 hover:bg-muted/60 sm:px-3">
      <div className="flex items-center gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5", tint)}>
          <Icon className="!size-5" />
        </span>
        <span className="block text-[15px] font-bold text-foreground">{title}</span>
      </div>
      <span className="mt-1.5 block text-[13px] leading-6 text-muted-foreground">{description}</span>
    </li>
  );
}
