"use client";

import { CircleCheck, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SURFACE_CARD } from "@/lib/styles";
import { FORM_LABELS } from "./data";

export function SubmissionSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className={SURFACE_CARD + " flex h-full min-h-80 flex-col items-center justify-center p-8 text-center"}>
      <span className="flex size-14 items-center justify-center rounded-full bg-belt-green/15 text-belt-green ring-1 ring-belt-green/25">
        <CircleCheck className="!size-7" />
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-belt-black">{FORM_LABELS.successTitle}</h3>
      <p className="mt-2 max-w-sm text-[13px] leading-7 text-muted-foreground sm:text-sm">
        {FORM_LABELS.successDescription}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="mt-6 h-11 gap-2 rounded-xl px-6 text-sm font-bold"
      >
        <RotateCcw className="!size-4" />
        {FORM_LABELS.resetAction}
      </Button>
    </div>
  );
}