"use client";

import { useEffect, useMemo, useState } from "react";

const ACTIVE_OFFSET = 160;

export function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join("|");
  const headingIds = useMemo(() => (key ? key.split("|") : []), [key]);

  useEffect(() => {
    if (headingIds.length === 0) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const marker = window.scrollY + ACTIVE_OFFSET;
      let current: string | null = null;

      for (const id of headingIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = id;
      }

      setActiveId(current ?? headingIds[0]);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headingIds]);

  return activeId;
}
