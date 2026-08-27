import { COMMENT_FORM_ERRORS } from "@/data/blog/comments";
import { isValidEmail, MIN_MESSAGE_LENGTH } from "@/lib/validation";

export interface CommentDraft {
  name: string;
  email: string;
  message: string;
}

export type CommentDraftErrors = Partial<Record<keyof CommentDraft, string>>;

export const EMPTY_COMMENT_DRAFT: CommentDraft = { name: "", email: "", message: "" };

export function validateCommentDraft(draft: CommentDraft): CommentDraftErrors {
  const errors: CommentDraftErrors = {};

  if (!draft.name.trim()) errors.name = COMMENT_FORM_ERRORS.name;

  if (!draft.email.trim()) {
    errors.email = COMMENT_FORM_ERRORS.emailRequired;
  } else if (!isValidEmail(draft.email)) {
    errors.email = COMMENT_FORM_ERRORS.emailInvalid;
  }

  if (draft.message.trim().length < MIN_MESSAGE_LENGTH) errors.message = COMMENT_FORM_ERRORS.messageShort;

  return errors;
}
