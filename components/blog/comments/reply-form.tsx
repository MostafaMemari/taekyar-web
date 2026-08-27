"use client";

import { useState } from "react";
import { CornerDownLeft } from "lucide-react";

import {
  COMMENT_REPLY_LABELS,
  COMMENT_TOAST_MESSAGES,
} from "@/data/blog/comments";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  EMPTY_COMMENT_DRAFT,
  submitComment,
  validateCommentDraft,
  type CommentDraft,
  type CommentDraftErrors,
} from "./comment-submission";
import { CommentDraftFields } from "./comment-form-fields";

interface ReplyFormProps {
  parentAuthor: string;
  onCancel: () => void;
}

export function ReplyForm({ parentAuthor, onCancel }: ReplyFormProps) {
  const [draft, setDraft] = useState<CommentDraft>(EMPTY_COMMENT_DRAFT);
  const [errors, setErrors] = useState<CommentDraftErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(key: keyof CommentDraft, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCommentDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await submitComment();
      toast({
        tone: "success",
        title: COMMENT_TOAST_MESSAGES.successTitle,
        description: COMMENT_TOAST_MESSAGES.successDescription,
      });
      onCancel();
    } catch {
      toast({
        tone: "error",
        title: COMMENT_TOAST_MESSAGES.errorTitle,
        description: COMMENT_TOAST_MESSAGES.errorDescription,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-3.5 rounded-xl bg-background p-4 ring-1 ring-black/[0.04]">
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

      <form noValidate onSubmit={handleSubmit} className="mt-4 space-y-4">
        <CommentDraftFields
          idPrefix="comment-reply"
          draft={draft}
          errors={errors}
          messageLabel={COMMENT_REPLY_LABELS.messageLabel}
          messagePlaceholder={COMMENT_REPLY_LABELS.messagePlaceholder}
          onFieldChange={handleFieldChange}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-10 w-full gap-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto sm:px-6"
        >
          {COMMENT_REPLY_LABELS.submit}
        </Button>
      </form>
    </div>
  );
}
