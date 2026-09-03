"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";

interface ErrorContentProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  homeHref?: string;
  homeLabel?: string;
}

export function ErrorContent({
  title = "مشکلی پیش آمد",
  description = "نتوانستیم این صفحه را بارگذاری کنیم؛ اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.",
  onRetry,
  retryLabel = "تلاش مجدد",
  homeHref = "/blog",
  homeLabel = "بازگشت به وبلاگ",
}: ErrorContentProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20 sm:size-16">
        <TriangleAlert className="size-7 sm:size-8" aria-hidden="true" />
      </span>
      <BeltDivider variant="pill" className="mt-5 h-1 w-16 sm:w-20" />
      <h1 className="mt-5 text-balance text-xl font-black leading-[1.6] tracking-tight sm:text-2xl">
        {title}
      </h1>
      <p className="mt-2.5 max-w-sm text-pretty text-sm leading-7 text-muted-foreground">{description}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button
            type="button"
            onClick={onRetry}
            className="h-11 gap-2 rounded-xl px-6 text-[13px] font-bold shadow-lg shadow-primary/20"
          >
            {retryLabel}
          </Button>
        ) : null}
        <Button
          asChild
          variant="outline"
          className="h-11 gap-2 rounded-xl border-border bg-card px-6 text-[13px] font-bold text-foreground hover:bg-muted"
        >
          <Link href={homeHref}>{homeLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
