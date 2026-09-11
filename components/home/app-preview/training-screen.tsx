"use client";

import { useState } from "react";
import { Check, ChevronRight, Trophy } from "lucide-react";

import { cn, toFaDigits } from "@/lib/utils";
import { HERO_APP_PREVIEW, TODAY_TRAININGS } from "@/data/home/hero";

interface TrainingScreenProps {
  onBack: () => void;
}

export function TrainingScreen({ onBack }: TrainingScreenProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  const total = TODAY_TRAININGS.length;
  const allDone = completed.length === total;
  const progress = Math.round((completed.length / total) * 100);

  const toggleTraining = (title: string) => {
    setCompleted((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  return (
    <div className="flex h-full flex-col gap-2.5 sm:gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/[0.05] text-black/60 transition-colors hover:bg-black/10 hover:text-black"
        >
          <ChevronRight className="size-4" />
        </button>
        <p className="text-[13px] font-extrabold text-black">تمرین امروز</p>
        <span className="w-7 shrink-0" />
      </div>

      {allDone ? (
        <div className="flex flex-col items-center rounded-2xl bg-primary/[0.07] px-3 py-4 text-center sm:py-5">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trophy className="size-5" />
          </span>
          <p className="mt-2.5 text-[13px] font-black text-black">تمرین کامل شد!</p>
          <p className="mt-1 text-[10px] font-medium text-black/50">
            آفرین، یک قدم به کمربند بعدی نزدیک‌تر شدی
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 h-8 cursor-pointer rounded-lg bg-primary px-5 text-[11px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            بازگشت به خانه
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {TODAY_TRAININGS.map(({ Icon, title, meta, duration, tint }) => {
            const done = completed.includes(title);
            return (
              <li key={title}>
                <button
                  type="button"
                  aria-pressed={done}
                  onClick={() => toggleTraining(title)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-xl border p-2 text-start transition-all duration-200 sm:gap-2.5 sm:p-2.5",
                    done
                      ? "border-primary/30 bg-primary/[0.06]"
                      : "border-black/5 bg-[#fafaf8] hover:border-primary/30"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                      done ? "border-primary bg-primary text-white" : "border-black/15 text-transparent"
                    )}
                  >
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg sm:size-8", tint)}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[11px] font-bold", done ? "text-black/40" : "text-black")}>
                      {title}
                    </span>
                    <span className="mt-0.5 block text-[9px] text-black/40">{meta}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold text-black/40">{duration}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-extrabold text-black">
            {toFaDigits(completed.length)} از {toFaDigits(total)} جلسه
          </p>
          <p className="text-[9px] font-bold text-primary">{toFaDigits(progress)}٪</p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
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
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${HERO_APP_PREVIEW.beltPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
