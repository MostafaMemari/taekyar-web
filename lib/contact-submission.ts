import {
  FORM_ERRORS,
  FORM_LABELS,
  SUBJECT_OPTIONS,
  SUPPORT_EMAIL,
  type ContactMessageDraft,
} from "@/data/contact";
import { isValidEmail, MIN_MESSAGE_LENGTH } from "@/lib/validation";

export type ContactDraftErrors = Partial<Record<keyof ContactMessageDraft, string>>;

export const EMPTY_CONTACT_DRAFT: ContactMessageDraft = {
  name: "",
  email: "",
  subject: SUBJECT_OPTIONS[0],
  message: "",
};

export function validateContactDraft(draft: ContactMessageDraft): ContactDraftErrors {
  const errors: ContactDraftErrors = {};

  if (!draft.name.trim()) errors.name = FORM_ERRORS.name;

  if (!draft.email.trim()) {
    errors.email = FORM_ERRORS.emailRequired;
  } else if (!isValidEmail(draft.email)) {
    errors.email = FORM_ERRORS.emailInvalid;
  }

  if (draft.message.trim().length < MIN_MESSAGE_LENGTH) errors.message = FORM_ERRORS.messageShort;

  return errors;
}

export function buildMailtoLink(draft: ContactMessageDraft): string {
  const subject = `[${draft.subject}] پیام از فرم تماس`;
  const body = `${draft.message}\n\n—\n${FORM_LABELS.name}: ${draft.name}\n${FORM_LABELS.email}: ${draft.email}`;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
