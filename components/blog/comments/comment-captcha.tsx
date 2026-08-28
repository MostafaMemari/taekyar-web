"use client";

import { RotateCcw } from "lucide-react";

import { FieldLabel, getAriaProps } from "@/components/shared/form-controls";
import { COMMENT_FORM_LABELS } from "@/data/blog/comments";

interface CommentCaptchaProps {
  idPrefix: string;
  svg: string | null;
  isLoading: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onRefresh: () => void;
}

export function CommentCaptcha({
  idPrefix,
  svg,
  isLoading,
  value,
  onValueChange,
  onRefresh,
}: CommentCaptchaProps) {
  return (
    <div>
      <FieldLabel htmlFor={`${idPrefix}-captcha`}>{COMMENT_FORM_LABELS.captchaLabel}</FieldLabel>

      <div className="flex flex-wrap items-stretch gap-2">
        <div className="flex items-stretch gap-2">
          <div className="flex min-h-[68px] w-40 select-none items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/60 p-2 text-foreground sm:w-48">
            {svg && !isLoading ? (
              <div
                role="img"
                aria-label={COMMENT_FORM_LABELS.captchaLabel}
                className="[&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : isLoading ? (
              <span aria-hidden="true" className="text-xs font-medium text-muted-foreground">…</span>
            ) : (
              <span className="text-center text-[11px] leading-4 text-muted-foreground">
                {COMMENT_FORM_LABELS.captchaUnavailable}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={COMMENT_FORM_LABELS.captchaRefresh}
            title={COMMENT_FORM_LABELS.captchaRefresh}
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 basis-full items-center sm:basis-40">
          <input
            {...getAriaProps(`${idPrefix}-captcha`, undefined, "h-11 text-center font-bold tracking-[0.25em]")}
            type="text"
            dir="ltr"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            placeholder={COMMENT_FORM_LABELS.captchaPlaceholder}
            aria-label={COMMENT_FORM_LABELS.captchaHint}
            aria-describedby={`${idPrefix}-captcha-hint`}
            onChange={(event) => onValueChange(event.target.value)}
          />
        </div>
      </div>

      <p id={`${idPrefix}-captcha-hint`} className="mt-1.5 text-xs leading-5 text-muted-foreground">
        {COMMENT_FORM_LABELS.captchaHint}
      </p>
    </div>
  );
}