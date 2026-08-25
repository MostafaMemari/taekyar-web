"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollToTopInstantly() {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  root.style.scrollBehavior = previousBehavior;
}

export function ScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const markHistoryNavigation = () => {
      isHistoryNavigation.current = true;
    };

    window.addEventListener("popstate", markHistoryNavigation);
    return () => window.removeEventListener("popstate", markHistoryNavigation);
  }, []);

  useEffect(() => {
    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }

    if (window.location.hash) return;

    scrollToTopInstantly();

    const frame = requestAnimationFrame(() => {
      if (!window.location.hash && window.scrollY !== 0) scrollToTopInstantly();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}
