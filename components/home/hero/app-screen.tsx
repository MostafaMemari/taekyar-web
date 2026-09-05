import { Dumbbell, Home, Play, User } from "lucide-react";

import { HERO_APP_PREVIEW } from "@/data/home/hero";

interface AppScreenProps {
  belts: string[];
}

export function AppScreen({ belts }: AppScreenProps) {
  const progress = Math.round(
    (HERO_APP_PREVIEW.weekDone / HERO_APP_PREVIEW.weekTotal) * 100
  );

  return (
    <div className="overflow-hidden rounded-[2.1rem] bg-white">
      <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-bold text-black/70">
        <span>۹:۴۱</span>
        <span className="h-5 w-16 rounded-full bg-[#16161a]" />
        <span className="flex items-end gap-[3px]">
          <span className="h-1 w-[3px] rounded-full bg-black/50" />
          <span className="h-1.5 w-[3px] rounded-full bg-black/50" />
          <span className="h-2 w-[3px] rounded-full bg-black/50" />
          <span className="h-2.5 w-[3px] rounded-full bg-black/70" />
        </span>
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-black/45">
              {HERO_APP_PREVIEW.greeting}
            </p>
            <p className="text-[13px] font-extrabold text-black">
              {HERO_APP_PREVIEW.weekTitle}
            </p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <User className="size-4" />
          </span>
        </div>

        <div className="rounded-2xl bg-[#fafaf8] p-3 ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-black/60">
              {HERO_APP_PREVIEW.beltLabel}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
              {HERO_APP_PREVIEW.beltProgress}
            </span>
          </div>
          <div className="relative mt-3">
            <div className="flex h-2.5 gap-[3px] rounded-full bg-black/[0.06] p-[2px]">
              {belts.map((color) => (
                <span key={color} className="h-full flex-1 rounded-[3px]" style={{ background: color }} />
              ))}
            </div>
            <span
              className="absolute -top-[3px] size-2 rounded-full bg-primary shadow-md ring-2 ring-white"
              style={{ insetInlineStart: "calc(52% - 4px)" }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-[#fafaf8] p-3 ring-1 ring-black/5">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-extrabold text-black">
              {HERO_APP_PREVIEW.weekDone} {HERO_APP_PREVIEW.weekLabel}
            </p>
            <p className="text-[9px] font-bold text-primary">{progress}٪</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2.5 flex items-center gap-2 border-t border-black/5 pt-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <Play className="size-3 fill-current" />
            </span>
            <p className="min-w-0 flex-1 truncate text-[10px] font-bold text-black">
              {HERO_APP_PREVIEW.nextLabel} · {HERO_APP_PREVIEW.nextSession}
            </p>
            <span className="shrink-0 text-[9px] font-semibold text-black/40">
              {HERO_APP_PREVIEW.nextTime}
            </span>
          </div>
        </div>

        <div className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-[11px] font-bold text-white shadow-md shadow-primary/30">
          <Play className="size-3 fill-current" />
          {HERO_APP_PREVIEW.startLabel}
        </div>
      </div>

      <div className="flex items-center justify-around border-t border-black/5 px-6 py-2.5 text-black/30">
        <Home className="size-4 text-primary" />
        <Dumbbell className="size-4" />
        <User className="size-4" />
      </div>
    </div>
  );
}
