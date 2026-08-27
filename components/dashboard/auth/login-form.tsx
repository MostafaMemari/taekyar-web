"use client";

import { useActionState } from "react";

import { FieldError, FieldLabel, INPUT_CLASSES } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { LOGIN_LABELS } from "@/data/dashboard/ui";
import { login } from "@/lib/admin-actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {});

  return (
    <form action={formAction} noValidate className="mt-5 space-y-4">
      <div>
        <FieldLabel htmlFor="login-username">{LOGIN_LABELS.username}</FieldLabel>
        <input
          id="login-username"
          name="username"
          type="text"
          dir="ltr"
          autoComplete="username"
          required
          placeholder={LOGIN_LABELS.usernamePlaceholder}
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <FieldLabel htmlFor="login-password">{LOGIN_LABELS.password}</FieldLabel>
        <input
          id="login-password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          placeholder={LOGIN_LABELS.passwordPlaceholder}
          className={INPUT_CLASSES}
        />
      </div>

      {state.error ? (
        <FieldError errorId="login-error" message={LOGIN_LABELS.invalid} />
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full gap-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
      >
        {LOGIN_LABELS.submit}
      </Button>
    </form>
  );
}
