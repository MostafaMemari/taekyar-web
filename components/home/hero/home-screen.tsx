import { Play, User } from "lucide-react";

import { HERO_APP_PREVIEW } from "@/data/home/hero";

interface HomeScreenProps {
  belts: string[];
  onStartTraining: () => void;
}

export function HomeScreen({ belts, onStartTraining }: HomeScreenProps) {
  const progress = Math.round(
    (HERO_APP_PREVIEW.weekDone / HERO_APP_PREVIEW.weekTotal) * 100
  );

  return (
    <div className="flex h-full flex-col gap-3">
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

      <button
        type="button"
        onClick={onStartTraining}
        className="mt-auto flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary text-[11px] font-bold text-white shadow-md shadow-primary/30 transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Play className="size-3 fill-current" />
        {HERO_APP_PREVIEW.startLabel}
      </button>
    </div>
  );
}
