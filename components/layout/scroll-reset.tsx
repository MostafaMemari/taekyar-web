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
  const previous = useRef<{ pathname: string; page: string } | null>(null);

  useEffect(() => {
    const markHistoryNavigation = () => {
      isHistoryNavigation.current = true;
    };

    window.addEventListener("popstate", markHistoryNavigation);
    return () => window.removeEventListener("popstate", markHistoryNavigation);
  }, []);

  useEffect(() => {
    const snapshot = { pathname, page: searchParams.get("page") ?? "" };

    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      previous.current = snapshot;
      return;
    }

    if (window.location.hash) {
      previous.current = snapshot;
      return;
    }

    const prev = previous.current;
    previous.current = snapshot;

    if (prev && prev.pathname === snapshot.pathname && prev.page !== snapshot.page) {
      return;
    }

    scrollToTopInstantly();

    const frame = requestAnimationFrame(() => {
      if (!window.location.hash && window.scrollY !== 0) scrollToTopInstantly();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}
