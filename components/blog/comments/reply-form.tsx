"use client";

import { useState } from "react";
import { CornerDownLeft, Loader2 } from "lucide-react";

import {
  COMMENT_REPLY_LABELS,
  COMMENT_TOAST_MESSAGES,
} from "@/data/blog/comments";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { submitComment } from "@/lib/comment-actions";
import {
  EMPTY_COMMENT_DRAFT,
  validateCommentDraft,
  type CommentDraft,
  type CommentDraftErrors,
} from "@/lib/comment-submission";
import { CommentDraftFields } from "./comment-form-fields";
import { CommentCaptcha } from "./comment-captcha";
import { useCommentCaptcha } from "./hooks/use-comment-captcha";

interface ReplyFormProps {
  postSlug: string;
  parentId: string;
  parentAuthor: string;
  onCancel: () => void;
}

export function ReplyForm({ postSlug, parentId, parentAuthor, onCancel }: ReplyFormProps) {
  const [draft, setDraft] = useState<CommentDraft>(EMPTY_COMMENT_DRAFT);
  const [errors, setErrors] = useState<CommentDraftErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captcha = useCommentCaptcha();

  function handleFieldChange(key: keyof CommentDraft, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCommentDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!captcha.challenge) return;
    if (!captcha.answer.trim()) {
      toast({
        tone: "error",
        title: COMMENT_TOAST_MESSAGES.captchaMissingTitle,
        description: COMMENT_TOAST_MESSAGES.captchaMissingDescription,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitComment(postSlug, draft, {
        parentId,
        captchaId: captcha.challenge.id,
        captchaAnswer: captcha.answer,
        honeypot,
      });
      if (!result.ok) {
        if (result.reason === "captcha_wrong") {
          toast({
            tone: "error",
            title: COMMENT_TOAST_MESSAGES.captchaWrongTitle,
            description: COMMENT_TOAST_MESSAGES.captchaWrongDescription,
          });
        } else {
          toast({
            tone: "error",
            title: COMMENT_TOAST_MESSAGES.captchaExpiredTitle,
            description: COMMENT_TOAST_MESSAGES.captchaExpiredDescription,
          });
        }
        await captcha.refresh();
        return;
      }
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
          imageUrl={captcha.challenge?.imageUrl ?? null}
          isLoading={captcha.isLoading}
          value={captcha.answer}
          onValueChange={captcha.setAnswer}
          onRefresh={() => void captcha.refresh()}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || captcha.isLoading || !captcha.challenge}
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
