"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { CommentCaptcha } from "@/components/blog/comments/comment-captcha";
import { useCommentCaptcha } from "@/components/blog/comments/hooks/use-comment-captcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN_LABELS } from "@/data/dashboard/ui";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api/endpoints";
import { ApiClientError } from "@/lib/api/client";
import type { LoginErrorCode } from "@/types/api";

const ERROR_LABELS: Record<LoginErrorCode, string> = {
  invalid: LOGIN_LABELS.invalid,
  captcha_wrong: LOGIN_LABELS.captchaWrong,
  captcha_expired: LOGIN_LABELS.captchaExpired,
  rate_limited: LOGIN_LABELS.rateLimited,
};

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<LoginErrorCode | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const captcha = useCommentCaptcha();

  const captchaError =
    error === "captcha_wrong" ? LOGIN_LABELS.captchaWrong : error === "captcha_expired" ? LOGIN_LABELS.captchaExpired : undefined;

  const refreshCaptcha = captcha.refresh;

  useEffect(() => {
    if (error) refreshCaptcha();
  }, [error, refreshCaptcha]);

  const loginFailed = Boolean(error) && !captchaError;
  useEffect(() => {
    if (loginFailed && error) {
      toast({ tone: "error", title: "ورود ناموفق", description: ERROR_LABELS[error] });
    }
  }, [loginFailed, error]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsPending(true);
    try {
      await authApi.login({ username, password, captchaAnswer: captcha.answer });
      setError(undefined);
      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      const code =
        submitError instanceof ApiClientError && submitError.code in ERROR_LABELS
          ? (submitError.code as LoginErrorCode)
          : "invalid";
      setError(code);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
          aria-invalid={error === "invalid"}
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
          aria-invalid={error === "invalid"}
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
        error={captchaError}
      />
      <input type="hidden" name="captchaAnswer" value={captcha.answer} />

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
