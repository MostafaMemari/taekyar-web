"use client";

import { useRef } from "react";
import Image from "next/image";

import { HERO_MASCOT } from "@/data/home/hero";

const REVEAL_MASK =
  "radial-gradient(circle 160px at var(--mx, 50%) var(--my, 40%), black 20%, rgba(0, 0, 0, 0.75) 45%, transparent 74%)";

export function HeroMascot() {
  const frameRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLImageElement>(null);

  const reveal = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    const revealImage = revealRef.current;
    if (!frame || !revealImage) return;
    const rect = frame.getBoundingClientRect();
    revealImage.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    revealImage.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    revealImage.style.opacity = "1";
  };

  const hide = () => {
    if (revealRef.current) revealRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={reveal}
      onPointerEnter={reveal}
      onPointerLeave={hide}
      className="relative w-fit cursor-pointer"
    >
      <Image
        src={HERO_MASCOT.training.src}
        alt={HERO_MASCOT.training.alt}
        width={350}
        height={574}
        priority
        className="h-auto w-[230px] select-none motion-reduce:animate-none animate-[hero-float_5s_ease-in-out_infinite] sm:w-[290px] lg:w-[330px]"
      />
      <Image
        ref={revealRef}
        src={HERO_MASCOT.sparring.src}
        alt={HERO_MASCOT.sparring.alt}
        width={350}
        height={574}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 motion-reduce:animate-none animate-[hero-float_5s_ease-in-out_infinite]"
        style={{ maskImage: REVEAL_MASK, WebkitMaskImage: REVEAL_MASK }}
      />
    </div>
  );
}
