import { Download, Sparkles } from "lucide-react";

import { Section } from "@/components/shared/section";
import { APP_CARD } from "@/data/home/landing";

export function AppCard({ appDownloadUrl }: { appDownloadUrl?: string | null }) {
  const href = appDownloadUrl ?? "#download";

  return (
    <Section tone="default" className="bg-[#f5f1ea]">
      
        <div className="relative overflow-hidden rounded-[28px] border border-[#E0A800]/20 bg-gradient-to-bl from-[#FDF6E1] via-[#FBF0D2] to-[#F7E9C3] p-5 shadow-[0_30px_60px_-40px_rgba(154,109,0,0.4)] sm:p-8 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 start-1/4 size-72 rounded-full bg-[radial-gradient(circle,rgba(224,168,0,0.25),transparent_65%)]"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
              <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-3xl sm:leading-snug lg:text-[2.1rem]">
                {APP_CARD.title}
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-[15px] leading-8 text-black/60 sm:leading-9">
                {APP_CARD.description}
              </p>

              <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {APP_CARD.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-[#E0A800]/35 bg-white/70 px-4 py-1.5 text-[12px] font-bold text-[#8a6a00]"
                  >
                    {chip}
                  </li>
                ))}
              </ul>

              <a
                href={href}
                {...(appDownloadUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-7 inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-7 text-[15px] font-extrabold text-[#2A1F00] shadow-[0_12px_26px_-10px_rgba(154,109,0,0.6)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Download className="!size-[18px]" />
                {APP_CARD.cta}
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="rounded-[22px] border border-black/[0.07] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)] sm:p-5">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <p className="text-[13px] font-extrabold text-[#1b2330]">{APP_CARD.mockup.title}</p>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    <span className="size-1.5 rounded-full bg-black/15" />
                    <span className="size-1.5 rounded-full bg-black/15" />
                    <span className="size-1.5 rounded-full bg-[#E0A800]" />
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {APP_CARD.mockup.days.map((day) => {
                    const active = day === APP_CARD.mockup.activeDay;
                    return (
                      <li
                        key={day}
                        className={
                          active
                            ? "flex size-8 items-center justify-center rounded-lg bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-[12px] font-black text-[#2A1F00] shadow-[0_6px_12px_-6px_rgba(154,109,0,0.7)]"
                            : "flex size-8 items-center justify-center rounded-lg bg-[#FBF9F4] text-[12px] font-bold text-black/45"
                        }
                      >
                        {day}
                      </li>
                    );
                  })}
                </ul>

                <ul className="mt-4 flex flex-col gap-2.5">
                  {APP_CARD.mockup.rows.map((row) => (
                    <li
                      key={row.title}
                      className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-[#FBF9F4] px-3.5 py-3"
                    >
                      <span className="flex items-center gap-2 text-[13px] font-bold text-[#1b2330]">
                        <span className="flex size-5 items-center justify-center rounded-md bg-[#E0A800]/15 text-[10px] font-black text-[#a37800]">
                          ✦
                        </span>
                        {row.title}
                      </span>
                      <span className="rounded-md bg-[#E0A800]/12 px-2 py-0.5 text-[11px] font-black tabular-nums text-[#8a6a00]">
                        {row.badge}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-[#FBF5E4] px-3 py-2.5 text-center text-[11px] font-bold text-[#8a6a00]">
                  <Sparkles className="!size-3.5" />
                  {APP_CARD.mockup.footer}
                </p>
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-8 -bottom-3 h-8 rounded-[50%] bg-black/10 blur-lg"
              />
            </div>
          </div>
        </div>
      
    </Section>
  );
}
