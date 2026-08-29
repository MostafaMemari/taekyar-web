"use client";

import { useEffect, useActionState } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommentCaptcha } from "@/components/blog/comments/comment-captcha";
import { useCommentCaptcha } from "@/components/blog/comments/hooks/use-comment-captcha";
import { LOGIN_LABELS } from "@/data/dashboard/ui";
import { login } from "@/lib/admin-actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {});
  const captcha = useCommentCaptcha();

  useEffect(() => {
    if (state.error) captcha.refresh();
  }, [state, captcha.refresh]);

  return (
    <form action={formAction} noValidate className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="login-username" className="font-sans text-[13px] font-bold text-card-foreground">
          {LOGIN_LABELS.username}
        </Label>
        <Input
          id="login-username"
          name="username"
          type="text"
          dir="ltr"
          autoComplete="username"
          required
          placeholder={LOGIN_LABELS.usernamePlaceholder}
          className="h-11 rounded-xl bg-card font-sans text-sm text-card-foreground placeholder:text-muted-foreground"
          aria-invalid={Boolean(state.error)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-password" className="font-sans text-[13px] font-bold text-card-foreground">
          {LOGIN_LABELS.password}
        </Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          placeholder={LOGIN_LABELS.passwordPlaceholder}
          className="h-11 rounded-xl bg-card font-sans text-card-foreground placeholder:text-muted-foreground"
          aria-invalid={Boolean(state.error)}
        />
      </div>

      <CommentCaptcha
        idPrefix="login"
        imageUrl={captcha.imageUrl}
        status={captcha.status}
        value={captcha.answer}
        onValueChange={captcha.setAnswer}
        onRefresh={captcha.refresh}
        onImageLoad={captcha.onImageLoad}
        onImageError={captcha.onImageError}
      />
      <input type="hidden" name="captchaAnswer" value={captcha.answer} />

      {state.error ? (
        <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertTitle className="text-[13px] font-bold">ورود ناموفق</AlertTitle>
          <AlertDescription className="text-[13px] leading-5">
            {state.error === "captcha" ? LOGIN_LABELS.captchaInvalid : LOGIN_LABELS.invalid}
          </AlertDescription>
        </Alert>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-1 h-11 w-full gap-2 rounded-xl font-sans text-[13px] font-black shadow-lg shadow-primary/20 hover:bg-primary/90 motion-reduce:transition-none"
      >
        {isPending ? "در حال ورود…" : LOGIN_LABELS.submit}
      </Button>

      <p className="text-center font-sans text-[11px] leading-5 text-muted-foreground">
        دسترسی فقط برای مدیران تک‌یار — در صورت فراموشی گذرواژه با پشتیبانی تماس بگیرید.
      </p>
    </form>
  );
}
