"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

import {
  COMMENT_FORM_ERRORS,
  COMMENT_FORM_LABELS,
  COMMENTS_LABELS,
  type PostComment,
} from "@/components/blog/comments/data";
import {
  FieldError,
  FieldLabel,
  getAriaProps,
} from "@/components/contact/form-controls";
import { Button } from "@/components/ui/button";
import { SURFACE_CARD } from "@/lib/styles";
import { CommentFormSuccess } from "./comment-form-success";

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

/** Local placeholder for the future POST /comments mutation; no persistence yet. */
async function submitComment(draft: CommentDraft): Promise<PostComment> {
  return {
    id: `local-${Date.now()}`,
    author: draft.name.trim(),
    date: "همین حالا",
    message: draft.message.trim(),
  };
}

export function CommentForm() {
  const [draft, setDraft] = useState<CommentDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleFieldChange(key: keyof CommentDraft, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await submitComment(draft);
    setSubmitted(true);
  }

  function handleReset() {
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setSubmitted(false);
  }

  return (
    <div className={SURFACE_CARD + " p-5 sm:p-6"}>
      <h3 className="flex items-center gap-2 text-base font-extrabold">
        <PenLine className="size-4 text-primary" aria-hidden="true" />
        {COMMENTS_LABELS.formTitle}
      </h3>

      {submitted ? (
        <CommentFormSuccess onReset={handleReset} />
      ) : (
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
              className="h-11 w-full gap-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto sm:px-8"
            >
              {COMMENT_FORM_LABELS.submit}
            </Button>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              {COMMENT_FORM_LABELS.formHint}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
