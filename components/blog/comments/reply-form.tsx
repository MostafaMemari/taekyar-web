"use client";

import { CornerDownLeft, Loader2 } from "lucide-react";

import { COMMENT_REPLY_LABELS } from "@/data/blog/comments";
import { Button } from "@/components/ui/button";
import { useCommentSubmission } from "./hooks/use-comment-submission";
import { CommentDraftFields } from "./comment-form-fields";
import { CommentCaptcha } from "./comment-captcha";

interface ReplyFormProps {
  postSlug: string;
  parentId: string;
  parentAuthor: string;
  onCancel: () => void;
}

export function ReplyForm({ postSlug, parentId, parentAuthor, onCancel }: ReplyFormProps) {
  const { draft, errors, honeypot, setHoneypot, isSubmitting, captcha, handleFieldChange, handleSubmit } =
    useCommentSubmission({ postSlug, parentId, onSuccess: onCancel });

  return (
    <div className="relative mt-3.5 rounded-xl bg-background p-4 ring-1 ring-black/[0.04]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
          <CornerDownLeft className="size-3.5" aria-hidden="true" />
          {COMMENT_REPLY_LABELS.replyToPrefix} «{parentAuthor}»
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-7 rounded-lg px-2.5 text-xs font-bold text-muted-foreground"
        >
          {COMMENT_REPLY_LABELS.cancel}
        </Button>
      </div>

      <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-4 space-y-4">
        <CommentDraftFields
          idPrefix="comment-reply"
          draft={draft}
          errors={errors}
          messageLabel={COMMENT_REPLY_LABELS.messageLabel}
          messagePlaceholder={COMMENT_REPLY_LABELS.messagePlaceholder}
          onFieldChange={handleFieldChange}
        />

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="comment-reply-company">شرکت</label>
          <input
            id="comment-reply-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <CommentCaptcha
          idPrefix="comment-reply"
          imageUrl={captcha.imageUrl}
          status={captcha.status}
          value={captcha.answer}
          onValueChange={captcha.setAnswer}
          onRefresh={captcha.refresh}
          onImageLoad={captcha.onImageLoad}
          onImageError={captcha.onImageError}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !captcha.isReady}
          className="h-10 gap-2 rounded-xl px-6 text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {isSubmitting ? COMMENT_REPLY_LABELS.submitting : COMMENT_REPLY_LABELS.submit}
        </Button>
      </form>
    </div>
  );
}
