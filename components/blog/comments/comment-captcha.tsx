"use client";

import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

import { FieldError, FieldLabel, getAriaProps } from "@/components/shared/form-controls";
import { COMMENT_FORM_LABELS } from "@/data/blog/comments";
import { toPersianDigits } from "@/lib/utils";
import type { CaptchaStatus } from "./hooks/use-comment-captcha";

interface CommentCaptchaProps {
  idPrefix: string;
  imageUrl: string;
  status: CaptchaStatus;
  value: string;
  onValueChange: (value: string) => void;
  onRefresh: () => void;
  onImageLoad: () => void;
  onImageError: () => void;
  error?: string;
}

export function CommentCaptcha({
  idPrefix,
  imageUrl,
  status,
  value,
  onValueChange,
  onRefresh,
  onImageLoad,
  onImageError,
  error,
}: CommentCaptchaProps) {
  const isBusy = status === "loading" || status === "refreshing";
  const isUnavailable = status === "unavailable";
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const node = imageRef.current;
    if (!node || !node.complete) return;
    if (node.naturalWidth > 0) onImageLoad();
    else onImageError();
  }, [imageUrl, onImageLoad, onImageError]);

  return (
    <div>
      <FieldLabel htmlFor={`${idPrefix}-captcha`}>{COMMENT_FORM_LABELS.captchaLabel}</FieldLabel>

      <div className="flex flex-wrap items-stretch gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isBusy}
          title={COMMENT_FORM_LABELS.captchaClickHint}
          aria-label={COMMENT_FORM_LABELS.captchaClickHint}
          className="group relative flex h-[58px] w-40 shrink-0 select-none items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/60 text-foreground transition-colors hover:cursor-pointer hover:border-primary/40 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 sm:w-[161px]"
        >
          {isUnavailable ? (
            <span className="text-center text-[11px] leading-4 text-muted-foreground">{COMMENT_FORM_LABELS.captchaUnavailable}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={imageUrl}
              ref={imageRef}
              src={imageUrl}
              alt={COMMENT_FORM_LABELS.captchaLabel}
              width={200}
              height={72}
              draggable={false}
              onLoad={onImageLoad}
              onError={onImageError}
              className="h-full w-full object-contain"
            />
          )}

          {status === "loading" ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted/70 text-xs font-medium text-muted-foreground"
            >
              …
            </span>
          ) : null}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute end-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-card/85 text-muted-foreground opacity-70 shadow-sm transition-opacity group-hover:opacity-100"
          >
            <RotateCcw className="size-3" />
          </span>
        </button>

        <div className="flex min-w-0 flex-1 basis-full items-center sm:basis-40">
          <input
            {...getAriaProps(`${idPrefix}-captcha`, error, "h-10 text-center font-bold tracking-[0.25em]")}
            type="text"
            dir="ltr"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            placeholder={COMMENT_FORM_LABELS.captchaPlaceholder}
            aria-label={COMMENT_FORM_LABELS.captchaHint}
            aria-describedby={error ? `${idPrefix}-captcha-error` : `${idPrefix}-captcha-hint`}
            onChange={(event) => onValueChange(toPersianDigits(event.target.value))}
          />
        </div>
      </div>

      {error ? (
        <FieldError errorId={`${idPrefix}-captcha-error`} message={error} />
      ) : (
        <p id={`${idPrefix}-captcha-hint`} className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {COMMENT_FORM_LABELS.captchaHint}
          <span aria-hidden="true" className="mx-1.5">
            ·
          </span>
          <span className="text-muted-foreground/80">{COMMENT_FORM_LABELS.captchaClickHint}</span>
        </p>
      )}
    </div>
  );
}
