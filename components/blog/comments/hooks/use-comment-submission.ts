"use client";

import { useCallback, useState, type FormEvent } from "react";

import { COMMENT_TOAST_MESSAGES } from "@/data/blog/comments";
import { toast } from "@/hooks/use-toast";
import { submitComment, type SubmitCommentResult } from "@/lib/comment-actions";
import {
  EMPTY_COMMENT_DRAFT,
  validateCommentDraft,
  type CommentDraft,
  type CommentDraftErrors,
} from "@/lib/comment-submission";
import { useCommentCaptcha } from "./use-comment-captcha";

interface UseCommentSubmissionOptions {
  postSlug: string;
  parentId?: string;
  onSuccess?: () => void;
}

export function useCommentSubmission({ postSlug, parentId, onSuccess }: UseCommentSubmissionOptions) {
  const [draft, setDraft] = useState<CommentDraft>(EMPTY_COMMENT_DRAFT);
  const [errors, setErrors] = useState<CommentDraftErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captcha = useCommentCaptcha();
  const { isReady, answer, refresh } = captcha;

  const handleFieldChange = useCallback((key: keyof CommentDraft, value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }, []);

  const reject = useCallback(
    (result: SubmitCommentResult) => {
      if (result.reason === "rate_limited") {
        toast({
          tone: "error",
          title: COMMENT_TOAST_MESSAGES.rateLimitedTitle,
          description: COMMENT_TOAST_MESSAGES.rateLimitedDescription,
        });
      } else if (result.reason === "captcha_wrong") {
        toast({
          tone: "error",
          title: COMMENT_TOAST_MESSAGES.captchaWrongTitle,
          description: COMMENT_TOAST_MESSAGES.captchaWrongDescription,
        });
      } else if (result.reason === "captcha_expired") {
        toast({
          tone: "error",
          title: COMMENT_TOAST_MESSAGES.captchaExpiredTitle,
          description: COMMENT_TOAST_MESSAGES.captchaExpiredDescription,
        });
      }
      void refresh();
    },
    [refresh],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextErrors = validateCommentDraft(draft);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
      if (!isReady) return;
      if (!answer.trim()) {
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
          captchaAnswer: answer,
          honeypot,
        });
        if (!result.ok) {
          reject(result);
          return;
        }
        setDraft(EMPTY_COMMENT_DRAFT);
        setHoneypot("");
        await refresh();
        toast({
          tone: "success",
          title: COMMENT_TOAST_MESSAGES.successTitle,
          description: COMMENT_TOAST_MESSAGES.successDescription,
        });
        onSuccess?.();
      } catch {
        toast({
          tone: "error",
          title: COMMENT_TOAST_MESSAGES.errorTitle,
          description: COMMENT_TOAST_MESSAGES.errorDescription,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [draft, honeypot, parentId, postSlug, onSuccess, isReady, answer, refresh, reject],
  );

  return {
    draft,
    errors,
    honeypot,
    setHoneypot,
    isSubmitting,
    captcha,
    handleFieldChange,
    handleSubmit,
  };
}
