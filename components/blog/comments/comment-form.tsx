"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

import {
  COMMENT_FORM_LABELS,
  COMMENT_REPLY_LABELS,
  COMMENTS_LABELS,
  COMMENT_TOAST_MESSAGES,
} from "@/data/blog/comments";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { submitComment, type SubmitCommentResult } from "@/lib/comment-actions";
import { SURFACE_CARD } from "@/lib/styles";
import {
  EMPTY_COMMENT_DRAFT,
  validateCommentDraft,
  type CommentDraft,
  type CommentDraftErrors,
} from "@/lib/comment-submission";
import { CommentDraftFields } from "./comment-form-fields";
import { CommentCaptcha } from "./comment-captcha";
import { useCommentCaptcha } from "./hooks/use-comment-captcha";

interface CommentFormProps {
  postSlug: string;
  onCancel?: () => void;
}

export function CommentForm({ postSlug, onCancel }: CommentFormProps) {
  const [draft, setDraft] = useState<CommentDraft>(EMPTY_COMMENT_DRAFT);
  const [errors, setErrors] = useState<CommentDraftErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captcha = useCommentCaptcha();

  function handleFieldChange(key: keyof CommentDraft, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function handleRejection(result: SubmitCommentResult) {
    if (result.reason === "rate_limited") {
      toast({
        tone: "error",
        title: COMMENT_TOAST_MESSAGES.rateLimitedTitle,
        description: COMMENT_TOAST_MESSAGES.rateLimitedDescription,
      });
    } else {
      toast({
        tone: "error",
        title: COMMENT_TOAST_MESSAGES.captchaTitle,
        description: COMMENT_TOAST_MESSAGES.captchaDescription,
      });
    }
    void captcha.refresh();
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
        title: COMMENT_TOAST_MESSAGES.captchaTitle,
        description: COMMENT_TOAST_MESSAGES.captchaDescription,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitComment(postSlug, draft, {
        captchaId: captcha.challenge.id,
        captchaAnswer: captcha.answer,
        honeypot,
      });
      if (!result.ok) {
        handleRejection(result);
        return;
      }
      setDraft(EMPTY_COMMENT_DRAFT);
      setHoneypot("");
      await captcha.refresh();
      toast({
        tone: "success",
        title: COMMENT_TOAST_MESSAGES.successTitle,
        description: COMMENT_TOAST_MESSAGES.successDescription,
      });
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
    <div className={SURFACE_CARD + " p-5 sm:p-6"}>
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

      <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-4">
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
          question={captcha.challenge?.question ?? null}
          isLoading={captcha.isLoading}
          value={captcha.answer}
          onValueChange={captcha.setAnswer}
          onRefresh={() => void captcha.refresh()}
        />

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || captcha.isLoading || !captcha.challenge}
            className="h-11 w-full gap-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto sm:px-8"
          >
            {COMMENT_FORM_LABELS.submit}
          </Button>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            {COMMENT_FORM_LABELS.formHint}
          </p>
        </div>
      </form>
    </div>
  );
}
