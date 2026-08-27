"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SURFACE_CARD } from "@/lib/styles";
import {
  FORM_ERRORS,
  FORM_LABELS,
  SUBJECT_OPTIONS,
  SUPPORT_EMAIL,
  type ContactMessageDraft,
} from "@/data/contact";
import { FieldError, FieldLabel, getAriaProps } from "./form-controls";
import { SubmissionSuccess } from "./submission-success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

type DraftErrors = Partial<Record<keyof ContactMessageDraft, string>>;

const EMPTY_DRAFT: ContactMessageDraft = {
  name: "",
  email: "",
  subject: SUBJECT_OPTIONS[0],
  message: "",
};

function validateDraft(draft: ContactMessageDraft): DraftErrors {
  const errors: DraftErrors = {};

  if (!draft.name.trim()) errors.name = FORM_ERRORS.name;

  if (!draft.email.trim()) {
    errors.email = FORM_ERRORS.emailRequired;
  } else if (!EMAIL_PATTERN.test(draft.email)) {
    errors.email = FORM_ERRORS.emailInvalid;
  }

  if (draft.message.trim().length < MIN_MESSAGE_LENGTH) errors.message = FORM_ERRORS.messageShort;

  return errors;
}

function buildMailtoLink(draft: ContactMessageDraft): string {
  const subject = `[${draft.subject}] پیام از فرم تماس`;
  const body = `${draft.message}\n\n—\n${FORM_LABELS.name}: ${draft.name}\n${FORM_LABELS.email}: ${draft.email}`;
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
interface FieldProps {
  draft: ContactMessageDraft;
  errors: DraftErrors;
  onFieldChange: <Key extends keyof ContactMessageDraft>(
    key: Key,
    value: ContactMessageDraft[Key]
  ) => void;
}

function NameField({ draft, errors, onFieldChange }: FieldProps) {
  return (
    <div>
      <FieldLabel htmlFor="contact-name">{FORM_LABELS.name}</FieldLabel>
      <input
        {...getAriaProps("contact-name", errors.name)}
        type="text"
        autoComplete="name"
        value={draft.name}
        placeholder={FORM_LABELS.namePlaceholder}
        required
        onChange={(event) => onFieldChange("name", event.target.value)}
      />
      <FieldError errorId="contact-name-error" message={errors.name} />
    </div>
  );
}

function EmailField({ draft, errors, onFieldChange }: FieldProps) {
  return (
    <div>
      <FieldLabel htmlFor="contact-email">{FORM_LABELS.email}</FieldLabel>
      <input
        {...getAriaProps("contact-email", errors.email)}
        type="email"
        dir="ltr"
        autoComplete="email"
        value={draft.email}
        placeholder={FORM_LABELS.emailPlaceholder}
        required
        onChange={(event) => onFieldChange("email", event.target.value)}
      />
      <FieldError errorId="contact-email-error" message={errors.email} />
    </div>
  );
}

function SubjectField({ draft, onFieldChange }: Omit<FieldProps, "errors">) {
  return (
    <div>
      <FieldLabel htmlFor="contact-subject">{FORM_LABELS.subject}</FieldLabel>
      <select
        {...getAriaProps("contact-subject")}
        value={draft.subject}
        onChange={(event) => onFieldChange("subject", event.target.value)}
      >
        {SUBJECT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function MessageField({ draft, errors, onFieldChange }: FieldProps) {
  return (
    <div>
      <FieldLabel htmlFor="contact-message">{FORM_LABELS.message}</FieldLabel>
      <textarea
        {...getAriaProps("contact-message", errors.message, "min-h-36 resize-y")}
        value={draft.message}
        placeholder={FORM_LABELS.messagePlaceholder}
        rows={6}
        required
        onChange={(event) => onFieldChange("message", event.target.value)}
      />
      <FieldError errorId="contact-message-error" message={errors.message} />
    </div>
  );
}

export function ContactForm() {
  const [draft, setDraft] = useState<ContactMessageDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [sent, setSent] = useState(false);

  function handleFieldChange<Key extends keyof ContactMessageDraft>(
    key: Key,
    value: ContactMessageDraft[Key]
  ) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    window.location.href = buildMailtoLink(draft);
    setSent(true);
  }

  function handleReset() {
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setSent(false);
  }

  return (
    <div className={SURFACE_CARD + " h-full p-5 sm:p-7"}>
      {sent ? (
        <SubmissionSuccess onReset={handleReset} />
      ) : (
        <>
          <h2 className="text-lg font-extrabold sm:text-xl">{FORM_LABELS.legend}</h2>

          <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <NameField draft={draft} errors={errors} onFieldChange={handleFieldChange} />
              <EmailField draft={draft} errors={errors} onFieldChange={handleFieldChange} />
            </div>

            <SubjectField draft={draft} onFieldChange={handleFieldChange} />

            <MessageField draft={draft} errors={errors} onFieldChange={handleFieldChange} />

            <div>
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full gap-2 rounded-xl text-[15px] font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto sm:px-10"
              >
                <Send className="!size-4" />
                {FORM_LABELS.submit}
              </Button>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">{FORM_LABELS.formHint}</p>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
