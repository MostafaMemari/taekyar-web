import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { TECHNIQUE_FAMILIES, TECHNIQUES_PAGE } from "@/data/techniques";
import { toFaDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "دانشنامه فن‌های تکواندو",
  description: TECHNIQUES_PAGE.description,
  alternates: { canonical: "/techniques" },
};

export default function TechniquesPage() {
  const totalItems = TECHNIQUE_FAMILIES.reduce((sum, family) => sum + family.items.length, 0);
  const stats = [
    { value: toFaDigits(TECHNIQUE_FAMILIES.length), label: TECHNIQUES_PAGE.stats[0].label },
    { value: toFaDigits(totalItems), label: TECHNIQUES_PAGE.stats[1].label },
    { value: toFaDigits(6), label: TECHNIQUES_PAGE.stats[2].label },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "دانشنامه فن‌ها", path: "/techniques" },
        ])}
      />
      <div className="bg-warm-dots">
        <Section spacing="none" containerClassName="pb-10 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
          <Reveal>
            <h1 className="text-center text-balance font-heading text-[2rem] leading-[1.4] text-[#c79500] sm:text-[2.75rem] sm:leading-[1.3] lg:text-[3.25rem] lg:leading-[1.25]">
              {TECHNIQUES_PAGE.title}
            </h1>
            <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
              <span className="size-1.5 rotate-45 bg-[#E0A800]" />
              <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-pretty text-[15px] leading-8 text-black/55">
              {TECHNIQUES_PAGE.description}
            </p>
            <dl className="mt-8 flex items-start justify-center gap-10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dd className="font-heading text-3xl text-[#a37800]">{stat.value}</dd>
                  <dd className="mt-1 text-[12px] font-medium text-black/50">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Section>

        <Section spacing="none" containerClassName="pb-12 sm:pb-14">
          <ul className="grid gap-4 sm:grid-cols-2">
            {TECHNIQUE_FAMILIES.map((family) => (
              <li key={family.slug}>
                <Link
                  href={`/techniques/${family.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-6 text-start shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)] transition-colors hover:border-[#E0A800]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-base font-black text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]"
                      dir="ltr"
                    >
                      {family.korean}
                    </span>
                    <span className="rounded-full bg-[#E0A800]/12 px-3 py-1 text-[12px] font-black text-[#8a6a00]">
                      {toFaDigits(family.items.length)} {family.group === "فرم‌ها" ? "فرم" : "فن"}
                    </span>
                  </div>
                  <h2 className="mt-4 font-heading text-xl leading-[1.5] text-[#1b2330] transition-colors group-hover:text-[#a37800]">
                    {family.name}
                  </h2>
                  <p className="mt-1 text-[12px] font-bold text-[#a37800]">{family.group}</p>
                  <p className="mt-2 text-[13px] leading-7 text-black/55">{family.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-1">
                    {family.items.slice(0, 4).map((item) => (
                      <span
                        key={item.name}
                        className="rounded-full border border-black/[0.06] bg-black/[0.02] px-2.5 py-1 text-[11px] font-bold text-black/50"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-[13px] font-bold text-[#c79500] transition-all group-hover:gap-2.5">
                    دیدن همه
                    <ArrowLeft className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white/60 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-[#1b2330]">
              <Info className="size-4 text-[#a37800]" />
              {TECHNIQUES_PAGE.note.title}
            </h3>
            <p className="mt-2.5 text-[13px] leading-8 text-black/55">
              {TECHNIQUES_PAGE.note.description}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href={TECHNIQUES_PAGE.ctaHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#E0A800]/35 bg-[#FBF5E4] px-5 py-2.5 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
            >
              {TECHNIQUES_PAGE.ctaLabel}
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </Section>
      </div>
    </>
  );
}
