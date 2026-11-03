"use client";

import { useCallback, useState, type FormEvent } from "react";

import { COMMENT_TOAST_MESSAGES } from "@/data/blog/comments";
import { toast } from "@/hooks/use-toast";
import { ApiClientError } from "@/lib/api/client";
import { commentsApi } from "@/lib/api/endpoints";
import {
  EMPTY_COMMENT_DRAFT,
  validateCommentDraft,
  type CommentDraft,
  type CommentDraftErrors,
} from "@/lib/comment-submission";
import type { CommentRejectReason } from "@/types/api";
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
    (reason: CommentRejectReason) => {
      if (reason === "rate_limited") {
        toast({
          tone: "error",
          title: COMMENT_TOAST_MESSAGES.rateLimitedTitle,
          description: COMMENT_TOAST_MESSAGES.rateLimitedDescription,
        });
      } else if (reason === "captcha_wrong") {
        toast({
          tone: "error",
          title: COMMENT_TOAST_MESSAGES.captchaWrongTitle,
          description: COMMENT_TOAST_MESSAGES.captchaWrongDescription,
        });
      } else if (reason === "captcha_expired") {
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
        await commentsApi.submit({
          slug: postSlug,
          name: draft.name,
          message: draft.message,
          parentId,
          captchaAnswer: answer,
          honeypot,
        });
        setDraft(EMPTY_COMMENT_DRAFT);
        setHoneypot("");
        await refresh();
        toast({
          tone: "success",
          title: COMMENT_TOAST_MESSAGES.successTitle,
          description: COMMENT_TOAST_MESSAGES.successDescription,
        });
        onSuccess?.();
      } catch (error) {
        if (error instanceof ApiClientError) {
          reject(error.code as CommentRejectReason);
        } else {
          toast({
            tone: "error",
            title: COMMENT_TOAST_MESSAGES.errorTitle,
            description: COMMENT_TOAST_MESSAGES.errorDescription,
          });
        }
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
