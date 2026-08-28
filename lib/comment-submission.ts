import { COMMENT_FORM_ERRORS } from "@/data/blog/comments";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, MIN_MESSAGE_LENGTH } from "@/lib/validation";

export interface CommentDraft {
  name: string;
  message: string;
}

export type CommentDraftErrors = Partial<Record<keyof CommentDraft, string>>;

export const EMPTY_COMMENT_DRAFT: CommentDraft = { name: "", message: "" };

export function validateCommentDraft(draft: CommentDraft): CommentDraftErrors {
  const errors: CommentDraftErrors = {};

  if (!draft.name.trim()) {
    errors.name = COMMENT_FORM_ERRORS.name;
  } else if (draft.name.length > MAX_NAME_LENGTH) {
    errors.name = COMMENT_FORM_ERRORS.name;
  }

  if (draft.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = COMMENT_FORM_ERRORS.messageShort;
  } else if (draft.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = COMMENT_FORM_ERRORS.messageLong;
  }

  return errors;
}
