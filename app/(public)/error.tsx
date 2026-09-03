"use client";

import { useEffect } from "react";

import { ErrorContent } from "@/components/shared/error-content";
import { Section } from "@/components/shared/section";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <Section pattern="none" containerClassName="pb-10 sm:pb-14">
      <ErrorContent onRetry={reset} />
    </Section>
  );
}
