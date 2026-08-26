"use client";

import { useEffect, useState } from "react";

const BELT_FILL_COLORS = [
  "bg-belt-yellow",
  "bg-belt-green",
  "bg-belt-blue",
  "bg-belt-red",
  "bg-belt-black",
] as const;

export function ReadingProgress() {
  const [fraction, setFraction] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setFraction(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-black/[0.08] transition-opacity duration-300 motion-reduce:transition-none"
      style={{ opacity: fraction > 0.005 ? 1 : 0 }}
    >
      <div className="flex h-full">
        {BELT_FILL_COLORS.map((color, index) => {
          const fill = Math.min(1, Math.max(0, fraction * BELT_FILL_COLORS.length - index));
          return (
            <div key={color} className="h-full flex-1 overflow-hidden">
              <div
                className={`h-full transition-[width] duration-150 ease-out motion-reduce:transition-none ${color}`}
                style={{ width: `${fill * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
