"use client";

import { Loader2, PenLine } from "lucide-react";

import { COMMENT_FORM_LABELS, COMMENT_REPLY_LABELS, COMMENTS_LABELS } from "@/data/blog/comments";
import { Button } from "@/components/ui/button";
import { SURFACE_CARD } from "@/lib/styles";
import { useCommentSubmission } from "./hooks/use-comment-submission";
import { CommentDraftFields } from "./comment-form-fields";
import { CommentCaptcha } from "./comment-captcha";

interface CommentFormProps {
  postSlug: string;
  onCancel?: () => void;
}

export function CommentForm({ postSlug, onCancel }: CommentFormProps) {
  const { draft, errors, honeypot, setHoneypot, isSubmitting, captcha, handleFieldChange, handleSubmit } =
    useCommentSubmission({ postSlug });

  return (
    <div className={SURFACE_CARD + " relative p-5 sm:p-6"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-extrabold">
          <PenLine className="size-4 text-primary" aria-hidden="true" />
          {COMMENTS_LABELS.formTitle}
        </h3>
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-7 rounded-lg px-2.5 text-xs font-bold text-muted-foreground"
          >
            {COMMENT_REPLY_LABELS.cancel}
          </Button>
        ) : null}
      </div>

      <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-5 space-y-4">
        <CommentDraftFields
          idPrefix="comment"
          draft={draft}
          errors={errors}
          onFieldChange={handleFieldChange}
        />

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="comment-company">شرکت</label>
          <input
            id="comment-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <CommentCaptcha
          idPrefix="comment"
          imageUrl={captcha.imageUrl}
          status={captcha.status}
          value={captcha.answer}
          onValueChange={captcha.setAnswer}
          onRefresh={captcha.refresh}
          onImageLoad={captcha.onImageLoad}
          onImageError={captcha.onImageError}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !captcha.isReady}
            className="h-11 gap-2 rounded-xl px-8 text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {isSubmitting ? COMMENT_FORM_LABELS.submitting : COMMENT_FORM_LABELS.submit}
          </Button>
          <p className="text-xs leading-6 text-muted-foreground">
            {COMMENT_FORM_LABELS.formHint}
          </p>
        </div>
      </form>
    </div>
  );
}
