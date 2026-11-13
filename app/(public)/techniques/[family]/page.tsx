import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Section } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbJsonLd } from "@/lib/blog/structured-data";
import { getCategoryTree } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { TECHNIQUE_FAMILIES, TECHNIQUE_FAMILY_PAGE } from "@/data/techniques";
import { cn } from "@/lib/utils";

interface TechniqueFamilyPageProps {
  params: Promise<{ family: string }>;
}

const CHIP_IDLE =
  "inline-flex items-center rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-bold text-[#1b2330] shadow-[0_2px_10px_-6px_rgba(15,23,42,0.25)] transition-all duration-200 hover:border-[#E0A800]/50 hover:text-[#8a6a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
const CHIP_ACTIVE =
  "inline-flex items-center rounded-full border border-transparent bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-4 py-2 text-[13px] font-extrabold text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function generateStaticParams() {
  return TECHNIQUE_FAMILIES.map((family) => ({ family: family.slug }));
}

export async function generateMetadata({ params }: TechniqueFamilyPageProps): Promise<Metadata> {
  const { family: slug } = await params;
  const family = TECHNIQUE_FAMILIES.find((item) => item.slug === slug);

  if (!family) return { title: "خانواده فن یافت نشد" };

  return {
    title: `فن‌های ${family.name}`,
    description: family.description,
    alternates: { canonical: `/techniques/${family.slug}` },
  };
}

export default async function TechniqueFamilyPage({ params }: TechniqueFamilyPageProps) {
  const { family: slug } = await params;
  const family = TECHNIQUE_FAMILIES.find((item) => item.slug === slug);

  if (!family) notFound();

  const categoryTree = await getCategoryTree();
  const techniqueCategoryPath = categoryTree.find((node) => node.name === "تکنیک‌ها")?.path ?? null;
  const captionHref = techniqueCategoryPath ? categoryHref(techniqueCategoryPath) : "/blog";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "دانشنامه فن‌ها", path: "/techniques" },
          { name: family.name, path: `/techniques/${family.slug}` },
        ])}
      />
      <div className="bg-warm-dots">
        <Section spacing="none" containerClassName="pb-10 pt-8 sm:pt-10 lg:pt-12" id="archive-top">
          <Reveal>
            <nav aria-label="مسیر" className="flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-medium text-black/45">
              <Link href="/" className="rounded-sm transition-colors hover:text-[#a37800]">خانه</Link>
              <ChevronLeft aria-hidden="true" className="size-3.5 text-black/25" />
              <Link href="/techniques" className="rounded-sm transition-colors hover:text-[#a37800]">دانشنامه فن‌ها</Link>
              <ChevronLeft aria-hidden="true" className="size-3.5 text-black/25" />
              <span aria-current="page" className="font-bold text-[#1b2330]">{family.name}</span>
            </nav>

            <h1 className="mt-4 text-center text-balance font-heading text-[2rem] leading-[1.4] text-[#c79500] sm:text-[2.75rem] sm:leading-[1.3] lg:text-[3.25rem] lg:leading-[1.25]">
              فن‌های {family.name}
            </h1>
            <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
              <span className="size-1.5 rotate-45 bg-[#E0A800]" />
              <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-pretty text-[15px] leading-8 text-black/55">
              {family.description}
            </p>

            <ul className="mt-7 flex flex-wrap justify-center gap-2.5" role="navigation" aria-label="خانواده‌های فن">
              <li>
                <Link href="/techniques" className={CHIP_IDLE}>
                  {TECHNIQUE_FAMILY_PAGE.allChip}
                </Link>
              </li>
              {TECHNIQUE_FAMILIES.map((item) => {
                const active = item.slug === family.slug;

                return (
                  <li key={item.slug}>
                    <Link
                      href={`/techniques/${item.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={cn(active ? CHIP_ACTIVE : CHIP_IDLE)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Section>

        <Section spacing="none" containerClassName="pb-12 sm:pb-14">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {family.items.map((item) => (
              <li key={item.name}>
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-sm font-black text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]"
                      dir="ltr"
                    >
                      {item.korean}
                    </span>
                    <span className="rounded-full bg-[#E0A800]/12 px-2.5 py-1 text-[11px] font-black text-[#8a6a00]">
                      {family.group}
                    </span>
                  </div>
                  <h2 className="mt-4 font-heading text-lg leading-[1.5] text-[#1b2330]">{item.name}</h2>
                  <p className="mt-2 text-[12.5px] leading-6 text-black/55">{item.hint}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-[13px] leading-7 text-black/55">
            {TECHNIQUE_FAMILY_PAGE.captionLead}{" "}
            <Link
              href={captionHref}
              className="inline-flex items-center gap-1 font-extrabold text-[#c79500] underline decoration-[#E0A800]/40 underline-offset-4 transition-colors hover:text-[#a37800]"
            >
              {TECHNIQUE_FAMILY_PAGE.captionLinkLabel}
            </Link>{" "}
            {TECHNIQUE_FAMILY_PAGE.captionRest}
          </p>
        </Section>
      </div>
    </>
  );
}
