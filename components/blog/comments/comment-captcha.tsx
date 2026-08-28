"use client";

import { RotateCcw } from "lucide-react";

import { FieldLabel, getAriaProps } from "@/components/shared/form-controls";
import { COMMENT_FORM_LABELS } from "@/data/blog/comments";

interface CommentCaptchaProps {
  idPrefix: string;
  question: string | null;
  isLoading: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onRefresh: () => void;
}

export function CommentCaptcha({
  idPrefix,
  question,
  isLoading,
  value,
  onValueChange,
  onRefresh,
}: CommentCaptchaProps) {
  return (
    <div>
      <FieldLabel htmlFor={`${idPrefix}-captcha`}>{COMMENT_FORM_LABELS.captchaLabel}</FieldLabel>

      <div className="flex flex-wrap items-stretch gap-2">
        <div
          aria-hidden="true"
          className="flex min-h-[46px] min-w-28 select-none items-center justify-center rounded-xl border border-dashed border-border bg-muted/60 px-4 font-black tracking-widest text-foreground"
          dir="ltr"
        >
          {isLoading || !question ? (
            <span className="text-xs font-medium text-muted-foreground">…</span>
          ) : (
            <span className="text-lg">
              {question} = <span className="text-primary">؟</span>
            </span>
          )}
        </div>

        <input
          {...getAriaProps(`${idPrefix}-captcha`)}
          type="text"
          dir="ltr"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          placeholder={COMMENT_FORM_LABELS.captchaPlaceholder}
          aria-label={COMMENT_FORM_LABELS.captchaHint}
          onChange={(event) => onValueChange(event.target.value)}
        />

        <button
          type="button"
          aria-label={COMMENT_FORM_LABELS.captchaRefresh}
          title={COMMENT_FORM_LABELS.captchaRefresh}
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex size-[46px] shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
        {COMMENT_FORM_LABELS.captchaHint}
      </p>
    </div>
  );
}