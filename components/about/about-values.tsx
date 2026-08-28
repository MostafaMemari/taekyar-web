import { MessagesSquare, Sparkles, Target, TrendingUp } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { ABOUT_VALUES, type AboutIconName } from "@/data/about";

const ABOUT_ICONS: Record<AboutIconName, typeof Target> = {
  target: Target,
  "trending-up": TrendingUp,
  "messages-square": MessagesSquare,
  sparkles: Sparkles,
};

export function AboutValues() {
  return (
    <div>
      <SectionHeader eyebrow="ارزش‌های ما" title="چه چیزی تک‌یار را می‌سازد" />
      <ul className="mt-6 grid gap-3.5 sm:grid-cols-2 sm:gap-4 lg:mt-8 lg:grid-cols-4">
        {ABOUT_VALUES.map(({ id, title, description, iconName, chipClassName }) => {
          const Icon = ABOUT_ICONS[iconName];
          return (
            <li key={id} className={cn(SURFACE_CARD, "flex h-full flex-col p-5 sm:p-6")}>
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
                    chipClassName,
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <h3 className="min-w-0 truncate text-[15px] font-extrabold sm:text-base">{title}</h3>
              </div>
              <p className="mt-3 text-[13px] leading-7 text-muted-foreground">{description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
