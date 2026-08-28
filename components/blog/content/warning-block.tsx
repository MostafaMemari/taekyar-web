import { TriangleAlert } from "lucide-react";

export function WarningBlock({ text }: { text: string }) {
  return (
    <aside className="flex gap-2.5 rounded-xl border border-destructive/30 bg-destructive/[0.06] p-3.5 sm:gap-3.5 sm:p-5">
      <TriangleAlert
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-destructive sm:size-5"
        strokeWidth={2}
      />
      <div>
        <p className="text-[11px] font-bold text-destructive sm:text-xs">نکته مهم</p>
        <p className="mt-1 text-[13px] leading-6 text-foreground/90 sm:text-sm sm:leading-7">{text}</p>
      </div>
    </aside>
  );
}
