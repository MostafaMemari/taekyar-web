import { COMMENT_FORM_ERRORS } from "@/components/blog/comments/data";

export interface CommentDraft {
  name: string;
  email: string;
  message: string;
}

export type CommentDraftErrors = Partial<Record<keyof CommentDraft, string>>;

export const EMPTY_COMMENT_DRAFT: CommentDraft = { name: "", email: "", message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

export function validateCommentDraft(draft: CommentDraft): CommentDraftErrors {
  const errors: CommentDraftErrors = {};

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
export async function submitComment(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
}