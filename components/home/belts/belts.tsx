import Link from "next/link";

import { Section } from "@/components/shared/section";
import { BELTS_SECTION } from "@/data/home/landing";
import { toFaDigits } from "@/lib/utils";

const BELTS = [
  { name: "کمربند سفید", color: "#e2e8f0", light: true, order: 1 },
  { name: "کمربند زرد", color: "#f4c430", light: false, order: 2 },
  { name: "کمربند سبز", color: "#2e8b57", light: false, order: 3 },
  { name: "کمربند آبی", color: "#1f5fa8", light: false, order: 4 },
  { name: "کمربند قرمز", color: "#c21807", light: false, order: 5 },
  { name: "کمربند مشکی", color: "#0d0d0d", light: false, order: 6 },
];

export function Belts() {
  return (
    <Section id="belts" tone="default" className="bg-[#f5f1ea]">
      
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
            {BELTS_SECTION.title}
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-8 text-black/55">
            {BELTS_SECTION.description}
          </p>
        </div>
      

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {BELTS.map((belt) => (
            <li
              key={belt.name}
              className="relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-4 ps-5 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.25)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 start-0 w-1.5"
                style={{ backgroundColor: belt.color }}
              />
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[13px] font-extrabold text-[#1b2330] sm:text-sm">
                  {belt.name}
                </h3>
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-black"
                  style={{
                    backgroundColor: belt.color,
                    color: belt.light ? "#334155" : "#ffffff",
                  }}
                >
                  {toFaDigits(belt.order)}
                </span>
              </div>
              <p className="mt-2 text-[11px] font-medium text-black/45">
                مرحله {toFaDigits(belt.order)} از ۶
              </p>
            </li>
          
        ))}
      </ul>

      
        <p className="mt-8 text-center text-[13px] leading-7 text-black/55">
          {BELTS_SECTION.captionLead}{" "}
          <Link
            href="/blog"
            className="font-extrabold text-[#c79500] underline decoration-[#E0A800]/40 underline-offset-4 transition-colors hover:text-[#a37800]"
          >
            {BELTS_SECTION.captionLinkLabel}
          </Link>{" "}
          {BELTS_SECTION.captionRest}
        </p>
      
    </Section>
  );
}
