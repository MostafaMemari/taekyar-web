"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

import {
  COMMENT_FORM_ERRORS,
  COMMENT_FORM_LABELS,
  COMMENT_TOAST_MESSAGES,
  COMMENTS_LABELS,
} from "@/components/blog/comments/data";
import {
  FieldError,
  FieldLabel,
  getAriaProps,
} from "@/components/contact/form-controls";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SURFACE_CARD } from "@/lib/styles";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

interface CommentDraft {
  name: string;
  email: string;
  message: string;
}

type DraftErrors = Partial<Record<keyof CommentDraft, string>>;

const EMPTY_DRAFT: CommentDraft = { name: "", email: "", message: "" };

function validateDraft(draft: CommentDraft): DraftErrors {
  const errors: DraftErrors = {};

  if (!draft.name.trim()) errors.name = COMMENT_FORM_ERRORS.name;

  if (!draft.email.trim()) {
    errors.email = COMMENT_FORM_ERRORS.emailRequired;
  } else if (!EMAIL_PATTERN.test(draft.email)) {
    errors.email = COMMENT_FORM_ERRORS.emailInvalid;
  }

  if (draft.message.trim().length < MIN_MESSAGE_LENGTH) errors.message = COMMENT_FORM_ERRORS.messageShort;

  return errors;
}

/** Local placeholder for the future POST /comments mutation; rejects until a backend exists. */
async function submitComment(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export function CommentForm() {
  const [draft, setDraft] = useState<CommentDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(key: keyof CommentDraft, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await submitComment();
      setDraft(EMPTY_DRAFT);
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
      <h3 className="flex items-center gap-2 text-base font-extrabold">
        <PenLine className="size-4 text-primary" aria-hidden="true" />
        {COMMENTS_LABELS.formTitle}
      </h3>

      <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="comment-name">{COMMENT_FORM_LABELS.name}</FieldLabel>
            <input
              {...getAriaProps("comment-name", errors.name)}
              type="text"
              autoComplete="name"
              value={draft.name}
              placeholder={COMMENT_FORM_LABELS.namePlaceholder}
              required
              onChange={(event) => handleFieldChange("name", event.target.value)}
            />
            <FieldError errorId="comment-name-error" message={errors.name} />
          </div>

          <div>
            <FieldLabel htmlFor="comment-email">{COMMENT_FORM_LABELS.email}</FieldLabel>
            <input
              {...getAriaProps("comment-email", errors.email)}
              type="email"
              dir="ltr"
              autoComplete="email"
              value={draft.email}
              placeholder={COMMENT_FORM_LABELS.emailPlaceholder}
              required
              onChange={(event) => handleFieldChange("email", event.target.value)}
            />
            <FieldError errorId="comment-email-error" message={errors.email} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="comment-message">{COMMENT_FORM_LABELS.message}</FieldLabel>
          <textarea
            {...getAriaProps("comment-message", errors.message, "min-h-28 resize-y")}
            value={draft.message}
            placeholder={COMMENT_FORM_LABELS.messagePlaceholder}
            rows={4}
            required
            onChange={(event) => handleFieldChange("message", event.target.value)}
          />
          <FieldError errorId="comment-message-error" message={errors.message} />
        </div>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
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
