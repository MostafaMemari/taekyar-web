import Link from "next/link";
import { Check } from "lucide-react";

import { Section } from "@/components/shared/section";
import { CHECKLIST } from "@/data/home/landing";

export function Checklist() {
  return (
    <Section tone="default">
      
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
            {CHECKLIST.title}
          </h2>
        </div>
      

      
        <ul className="mt-8 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
          {CHECKLIST.items.map((item) => (
            <li key={item} className="flex items-center justify-between gap-4">
              <span className="text-[14px] font-medium text-black/60">{item}</span>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E0A800]/15 text-[#a37800]">
                <Check className="!size-3.5" />
              </span>
            </li>
          ))}
        </ul>
      

      
        <div className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white/60 p-6 sm:p-7">
          <h3 className="text-[15px] font-extrabold text-[#1b2330]">{CHECKLIST.honest.title}</h3>
          <p className="mt-2.5 text-[13px] leading-8 text-black/55">
            {CHECKLIST.honest.description}
          </p>
        </div>
      

      
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/blog"
            className="rounded-full border border-[#E0A800]/35 bg-[#FBF5E4] px-4 py-2 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
          >
            مقالات تکواندو
          </Link>
          <Link
            href="#belts"
            className="rounded-full border border-[#E0A800]/35 bg-[#FBF5E4] px-4 py-2 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
          >
            کمربندها
          </Link>
          <Link
            href="#download"
            className="rounded-full border border-[#E0A800]/35 bg-[#FBF5E4] px-4 py-2 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
          >
            دانلود اپلیکیشن
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[#E0A800]/35 bg-[#FBF5E4] px-4 py-2 text-[13px] font-bold text-[#8a6a00] transition-colors duration-200 hover:border-[#E0A800]/60"
          >
            تماس با ما
          </Link>
        </div>
      
    </Section>
  );
}
