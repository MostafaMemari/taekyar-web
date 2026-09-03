"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function PaginationScrollTopInner({ targetId }: { targetId: string }) {
  const page = useSearchParams().get("page") ?? "";
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [page, targetId]);

  return null;
}

export function PaginationScrollTop({ targetId }: { targetId: string }) {
  return (
    <Suspense fallback={null}>
      <PaginationScrollTopInner targetId={targetId} />
    </Suspense>
  );
}
