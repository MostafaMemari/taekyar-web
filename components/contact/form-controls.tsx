import { cn } from "@/lib/utils";

export const INPUT_CLASSES =
  "w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm leading-7 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export interface FieldLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-bold text-foreground">
      {children}
    </label>
  );
}

interface FieldErrorProps {
  errorId: string;
  message?: string;
}

export function FieldError({ errorId, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium leading-5 text-destructive">
      <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-destructive" />
      {message}
    </p>
  );
}

export function getAriaProps(fieldId: string, errorMessage?: string, className?: string) {
  return {
    id: fieldId,
    "aria-invalid": Boolean(errorMessage),
    ...(errorMessage ? { "aria-describedby": `${fieldId}-error` } : {}),
    className: cn(INPUT_CLASSES, className),
  };
}