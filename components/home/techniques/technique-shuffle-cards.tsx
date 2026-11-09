"use client";

import { useEffect, useState } from "react";

import { TECHNIQUE_POOL, type Technique } from "@/data/home/techniques";

function pickRandomTechniques(count: number): Technique[] {
  const pool = [...TECHNIQUE_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function TechniqueShuffleCards() {
  const [picks, setPicks] = useState<Technique[]>(() => TECHNIQUE_POOL.slice(0, 4));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPicks(pickRandomTechniques(4)));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {picks.map((technique) => (
        <li key={technique.name}>
          <div className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between gap-3">
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-base font-black text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]"
                dir="ltr"
              >
                {technique.korean}
              </span>
              <span className="rounded-full bg-[#E0A800]/12 px-2.5 py-1 text-[11px] font-black text-[#8a6a00]">
                {technique.group}
              </span>
            </div>
            <h3 className="mt-4 text-[15px] font-extrabold text-[#1b2330]">{technique.name}</h3>
            <p className="mt-2 text-[12.5px] leading-6 text-black/55">{technique.hint}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
