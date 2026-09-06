"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { HERO2_CHARACTER, HERO2_FLOAT_BADGE } from "@/data/home/hero2";

const SIZES = "(max-width: 640px) 88vw, (max-width: 1024px) 60vw, 42vw";
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const SPOT_MASK =
  "radial-gradient(circle var(--spot) at var(--mx, -100%) var(--my, -100%), #000 55%, transparent 100%)";

export function Hero2Character() {
  const frameRef = useRef<HTMLDivElement>(null);
  const gearLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const gearLayer = gearLayerRef.current;
    if (!frame || !gearLayer) return;
    if (!window.matchMedia(HOVER_QUERY).matches) return;

    let rafId = 0;
    let spotX = 0;
    let spotY = 0;

    const applySpot = () => {
      rafId = 0;
      gearLayer.style.setProperty("--mx", `${spotX}px`);
      gearLayer.style.setProperty("--my", `${spotY}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      spotX = event.clientX - rect.left;
      spotY = event.clientY - rect.top;
      if (!rafId) rafId = requestAnimationFrame(applySpot);
    };

    const onPointerEnter = (event: PointerEvent) => {
      gearLayer.style.opacity = "1";
      onPointerMove(event);
    };

    const onPointerLeave = () => {
      gearLayer.style.opacity = "";
    };

    frame.addEventListener("pointerenter", onPointerEnter);
    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerleave", onPointerLeave);

    return () => {
      frame.removeEventListener("pointerenter", onPointerEnter);
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[440px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-2 bottom-6 top-12 -rotate-3 rounded-[3rem] bg-secondary"
      >
        <div
          aria-hidden="true"
          className="absolute inset-4 rounded-[2.2rem] border border-dashed border-border"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-10 top-16 rounded-full bg-primary/[0.06] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[100%] bg-black/15 blur-lg"
      />
      <div className="animate-hero-float absolute start-0 top-8 z-10 rounded-2xl border border-border/70 bg-card/95 px-3.5 py-2 shadow-lg shadow-black/[0.06] backdrop-blur-sm">
        <p className="text-[13px] font-black text-foreground">
          {HERO2_FLOAT_BADGE.title}
        </p>
        <p className="text-[11px] leading-4 text-muted-foreground">
          {HERO2_FLOAT_BADGE.description}
        </p>
      </div>
      <div
        ref={frameRef}
        className="animate-hero-float relative aspect-[1066/1475] w-full"
      >
        <Image
          src={HERO2_CHARACTER.baseSrc}
          alt={HERO2_CHARACTER.baseAlt}
          fill
          priority
          sizes={SIZES}
          draggable={false}
          className="select-none object-contain"
        />
        <div
          ref={gearLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [--spot:clamp(4.5rem,12vw,10rem)]"
          style={{ WebkitMaskImage: SPOT_MASK, maskImage: SPOT_MASK }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-background" />
          <div aria-hidden="true" className="absolute inset-x-2 bottom-6 top-12 -rotate-3 rounded-[3rem] bg-secondary">
            <div aria-hidden="true" className="absolute inset-4 rounded-[2.2rem] border border-dashed border-border" />
          </div>
          <div aria-hidden="true" className="absolute inset-x-6 bottom-10 top-16 rounded-full bg-primary/[0.06] blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-3 left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[100%] bg-black/15 blur-lg" />
          <Image
            src={HERO2_CHARACTER.gearSrc}
            alt=""
            fill
            sizes={SIZES}
            draggable={false}
            className="select-none object-contain"
          />
        </div>
      </div>
    </div>
  );
}
