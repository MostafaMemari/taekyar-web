"use client";

import { COMMENT_FORM_LABELS } from "@/data/blog/comments";
import {
  FieldError,
  FieldLabel,
  getAriaProps,
} from "@/components/contact/form-controls";
import type { CommentDraft, CommentDraftErrors } from "./comment-submission";

interface CommentDraftFieldsProps {
  idPrefix: string;
  draft: CommentDraft;
  errors: CommentDraftErrors;
  messageLabel?: string;
  messagePlaceholder?: string;
  onFieldChange: (key: keyof CommentDraft, value: string) => void;
}

export function CommentDraftFields({
  idPrefix,
  draft,
  errors,
  messageLabel = COMMENT_FORM_LABELS.message,
  messagePlaceholder = COMMENT_FORM_LABELS.messagePlaceholder,
  onFieldChange,
}: CommentDraftFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-name`}>{COMMENT_FORM_LABELS.name}</FieldLabel>
          <input
            {...getAriaProps(`${idPrefix}-name`, errors.name)}
            type="text"
            autoComplete="name"
            autoFocus
            value={draft.name}
            placeholder={COMMENT_FORM_LABELS.namePlaceholder}
            required
            onChange={(event) => onFieldChange("name", event.target.value)}
          />
          <FieldError errorId={`${idPrefix}-name-error`} message={errors.name} />
        </div>

        <div>
          <FieldLabel htmlFor={`${idPrefix}-email`}>{COMMENT_FORM_LABELS.email}</FieldLabel>
          <input
            {...getAriaProps(`${idPrefix}-email`, errors.email)}
            type="email"
            dir="ltr"
            autoComplete="email"
            value={draft.email}
            placeholder={COMMENT_FORM_LABELS.emailPlaceholder}
            required
            onChange={(event) => onFieldChange("email", event.target.value)}
          />
          <FieldError errorId={`${idPrefix}-email-error`} message={errors.email} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={`${idPrefix}-message`}>{messageLabel}</FieldLabel>
        <textarea
          {...getAriaProps(`${idPrefix}-message`, errors.message, "min-h-28 resize-y")}
          value={draft.message}
          placeholder={messagePlaceholder}
          rows={4}
          required
          onChange={(event) => onFieldChange("message", event.target.value)}
        />
        <FieldError errorId={`${idPrefix}-message-error`} message={errors.message} />
      </div>
    </>
  );
}
