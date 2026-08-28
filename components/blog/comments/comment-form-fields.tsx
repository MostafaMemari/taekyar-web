import { COMMENT_FORM_LABELS } from "@/data/blog/comments";
import {
  FieldError,
  FieldLabel,
  getAriaProps,
} from "@/components/shared/form-controls";
import type { CommentDraft, CommentDraftErrors } from "@/lib/comment-submission";

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
      <div>
        <FieldLabel htmlFor={`${idPrefix}-name`}>{COMMENT_FORM_LABELS.name}</FieldLabel>
        <input
          {...getAriaProps(`${idPrefix}-name`, errors.name)}
          type="text"
          autoComplete="name"
          value={draft.name}
          placeholder={COMMENT_FORM_LABELS.namePlaceholder}
          required
          onChange={(event) => onFieldChange("name", event.target.value)}
        />
        <FieldError errorId={`${idPrefix}-name-error`} message={errors.name} />
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
