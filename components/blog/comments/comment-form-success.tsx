import { CircleCheck } from "lucide-react";

import { COMMENT_FORM_LABELS } from "@/components/blog/comments/data";
import { Button } from "@/components/ui/button";

export function CommentFormSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-belt-green/15 text-belt-green ring-1 ring-belt-green/25">
        <CircleCheck className="!size-6" />
      </span>
      <p className="mt-4 text-sm font-extrabold sm:text-[15px]">{COMMENT_FORM_LABELS.successTitle}</p>
      <p className="mt-1.5 max-w-sm text-[13px] leading-7 text-muted-foreground">
        {COMMENT_FORM_LABELS.successDescription}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="mt-5 h-9 gap-2 rounded-xl px-5 text-sm font-bold"
      >
        {COMMENT_FORM_LABELS.resetAction}
      </Button>
    </div>
  );
}
