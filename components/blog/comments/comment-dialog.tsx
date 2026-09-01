"use client";

import { useState } from "react";
import { CornerDownLeft, Loader2, PenLine } from "lucide-react";

import {
  COMMENT_FORM_LABELS,
  COMMENT_REPLY_LABELS,
  COMMENTS_LABELS,
} from "@/data/blog/comments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCommentSubmission } from "./hooks/use-comment-submission";
import { CommentDraftFields } from "./comment-form-fields";
import { CommentCaptcha } from "./comment-captcha";

interface CommentDialogProps {
  postSlug: string;
  parentId?: string;
  parentAuthor?: string;
  trigger: React.ReactNode;
}

export function CommentDialog({ postSlug, parentId, parentAuthor, trigger }: CommentDialogProps) {
  const [open, setOpen] = useState(false);
  const isReply = Boolean(parentId);
  const { draft, errors, honeypot, setHoneypot, isSubmitting, captcha, handleFieldChange, handleSubmit } =
    useCommentSubmission({ postSlug, parentId, onSuccess: () => setOpen(false) });

  const idPrefix = isReply ? "comment-reply" : "comment";
  const title = isReply ? COMMENT_REPLY_LABELS.replyButton : COMMENTS_LABELS.formTitle;
  const description = isReply
    ? `${COMMENT_REPLY_LABELS.replyToPrefix} «${parentAuthor}»`
    : COMMENT_FORM_LABELS.formHint;
  const submitLabel = isReply ? COMMENT_REPLY_LABELS.submit : COMMENT_FORM_LABELS.submit;
  const submittingLabel = isReply ? COMMENT_REPLY_LABELS.submitting : COMMENT_FORM_LABELS.submitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isReply ? (
              <CornerDownLeft className="size-4 text-primary" aria-hidden="true" />
            ) : (
              <PenLine className="size-4 text-primary" aria-hidden="true" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="relative space-y-4">
          <CommentDraftFields
            idPrefix={idPrefix}
            draft={draft}
            errors={errors}
            messageLabel={isReply ? COMMENT_REPLY_LABELS.messageLabel : undefined}
            messagePlaceholder={isReply ? COMMENT_REPLY_LABELS.messagePlaceholder : undefined}
            onFieldChange={handleFieldChange}
          />

          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor={`${idPrefix}-company`}>شرکت</label>
            <input
              id={`${idPrefix}-company`}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <CommentCaptcha
            idPrefix={idPrefix}
            imageUrl={captcha.imageUrl}
            status={captcha.status}
            value={captcha.answer}
            onValueChange={captcha.setAnswer}
            onRefresh={captcha.refresh}
            onImageLoad={captcha.onImageLoad}
            onImageError={captcha.onImageError}
          />

          <DialogFooter className="flex-wrap items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="h-10 rounded-xl px-5 text-sm font-bold"
              onClick={() => setOpen(false)}
            >
              {COMMENT_REPLY_LABELS.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !captcha.isReady}
              className="h-10 gap-2 rounded-xl px-6 text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
