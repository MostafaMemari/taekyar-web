import { Lightbulb } from "lucide-react";

import { POST_LABELS } from "@/data/blog/post-config";

export function CoachTipBlock({ text }: { text: string }) {
  return (
    <aside className="flex gap-2.5 rounded-xl border border-belt-yellow/40 bg-belt-yellow/[0.09] p-3.5 sm:gap-3.5 sm:p-5">
      <Lightbulb
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-belt-yellow-fg sm:size-5"
        strokeWidth={2}
      />
      <div>
        <p className="text-[11px] font-bold text-belt-yellow-fg sm:text-xs">{POST_LABELS.coachTipLabel}</p>
        <p className="mt-1 text-[13px] leading-6 text-foreground/90 sm:text-sm sm:leading-7">{text}</p>
      </div>
    </aside>
  );
}
