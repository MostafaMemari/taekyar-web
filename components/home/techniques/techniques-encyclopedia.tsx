import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Section } from "@/components/shared/section";
import { TECHNIQUES_ENCYCLOPEDIA } from "@/data/home/techniques";
import { categoryHref } from "@/lib/routes";

interface TechniquesEncyclopediaProps {
  techniqueCategoryPath?: string | null;
}

export function TechniquesEncyclopedia({
  techniqueCategoryPath,
}: TechniquesEncyclopediaProps) {
  const href = techniqueCategoryPath ? categoryHref(techniqueCategoryPath) : "/blog";

  return (
    <Section tone="default">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
            {TECHNIQUES_ENCYCLOPEDIA.title}
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-8 text-black/55">
            {TECHNIQUES_ENCYCLOPEDIA.description}
          </p>
        </div>
        <dl className="flex shrink-0 items-center gap-8">
          {TECHNIQUES_ENCYCLOPEDIA.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-heading text-3xl text-[#a37800]">{stat.value}</dd>
              <dd className="mt-1 text-[12px] font-medium text-black/50">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TECHNIQUES_ENCYCLOPEDIA.families.map((family) => (
          <li key={family.name}>
            <div className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]">
                  <family.Icon className="!size-5" />
                </span>
                <span className="rounded-full bg-[#E0A800]/12 px-2.5 py-1 text-[11px] font-black text-[#8a6a00]">
                  {family.count}
                </span>
              </div>
              <h3 className="mt-4 flex items-baseline gap-2 text-[15px] font-extrabold text-[#1b2330]">
                {family.name}
                <span className="text-[11px] font-bold text-black/35" dir="ltr">
                  {family.korean}
                </span>
              </h3>
              <p className="mt-0.5 text-[11px] font-bold text-[#a37800]">{family.group}</p>
              <p className="mt-2 text-[12.5px] leading-6 text-black/55">{family.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                {family.examples.map((example) => (
                  <span
                    key={example}
                    className="rounded-full border border-black/[0.06] bg-black/[0.02] px-2 py-0.5 text-[10.5px] font-bold text-black/50"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-[13px] leading-7 text-black/55">
        {TECHNIQUES_ENCYCLOPEDIA.captionLead}{" "}
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-extrabold text-[#c79500] underline decoration-[#E0A800]/40 underline-offset-4 transition-colors hover:text-[#a37800]"
        >
          {TECHNIQUES_ENCYCLOPEDIA.captionLinkLabel}
          <ArrowLeft className="size-3.5" />
        </Link>{" "}
        {TECHNIQUES_ENCYCLOPEDIA.captionRest}
      </p>
    </Section>
  );
}
