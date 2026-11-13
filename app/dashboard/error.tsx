"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";

export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/[0.04] px-6 py-16 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-3 text-sm font-bold leading-[22px] text-foreground">{DASHBOARD_LABELS.errorTitle}</h1>
      <p className="mt-1 max-w-sm text-[13px] leading-5 text-muted-foreground">
        {DASHBOARD_LABELS.errorDescription}
      </p>
      {error.digest ? (
        <p dir="ltr" className="mt-2 font-mono text-[11px] text-muted-foreground/80">
          {error.digest}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" onClick={() => retry()} className="h-10 rounded-lg px-4 text-[13px] font-bold">
          {DASHBOARD_LABELS.errorRetry}
        </Button>
        <Button asChild variant="outline" className="h-10 rounded-lg px-4 text-[13px] font-bold">
          <Link href="/dashboard">{DASHBOARD_LABELS.errorHome}</Link>
        </Button>
      </div>
    </div>
  );
}
