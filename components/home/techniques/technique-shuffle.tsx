import Link from "next/link";
import { ArrowLeft, Repeat } from "lucide-react";

import { Section } from "@/components/shared/section";
import { TechniqueShuffleCards } from "@/components/home/techniques/technique-shuffle-cards";
import { TECHNIQUE_SHUFFLE } from "@/data/home/techniques";
import { categoryHref } from "@/lib/routes";

interface TechniqueShuffleProps {
  techniqueCategoryPath?: string | null;
}

export function TechniqueShuffle({ techniqueCategoryPath }: TechniqueShuffleProps) {
  const href = techniqueCategoryPath ? categoryHref(techniqueCategoryPath) : "/blog";

  return (
    <Section tone="default">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
            {TECHNIQUE_SHUFFLE.title}
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-8 text-black/55">
            {TECHNIQUE_SHUFFLE.description}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#E0A800]/25 bg-[#E0A800]/[0.08] px-3 py-1.5 text-xs font-bold text-[#a37800]">
          <Repeat className="size-3.5" />
          هر بار متفاوت
        </span>
      </div>

      <TechniqueShuffleCards />

      <div className="mt-8 flex justify-center">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full border border-[#E0A800]/35 bg-[#FBF5E4] px-5 py-2.5 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
        >
          {TECHNIQUE_SHUFFLE.actionLabel}
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
