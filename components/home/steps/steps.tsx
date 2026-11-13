import { Section } from "@/components/shared/section";
import { START } from "@/data/home/landing";
import { toFaDigits } from "@/lib/utils";

export function Steps() {
  return (
    <Section tone="default" className="bg-[#f5f1ea]">
      
        <div className="rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.25)] sm:p-8 lg:p-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
              {START.title}
            </h2>
            <p className="mt-5 border-s-[3px] border-[#E0A800] ps-5 text-pretty text-[15px] leading-8 text-black/55 sm:leading-9">
              {START.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-7">
            
              <div className="h-full rounded-3xl border border-[#E0A800]/25 bg-[#FBF5E4] p-6 sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#E0A800]/15 text-[#a37800]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    </svg>
                  </span>
                  <h3 className="text-base font-extrabold text-[#1b2330]">{START.tip.title}</h3>
                </div>
                <p className="mt-3 text-[13px] leading-7 text-black/55">{START.tip.description}</p>
              </div>
            

            
              <ol className="flex h-full flex-col gap-3.5">
                {START.items.map(({ Icon, title, description }, index) => (
                  <li
                    key={title}
                    className="flex flex-1 items-start gap-4 rounded-2xl border border-black/[0.07] bg-[#FBF9F4] p-4 sm:gap-5 sm:p-5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-sm font-black text-[#2A1F00] shadow-[0_6px_14px_-6px_rgba(154,109,0,0.6)]">
                      {toFaDigits(index + 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[15px] font-extrabold text-[#1b2330] sm:text-base">
                          {title}
                        </h3>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E0A800]/12 text-[#a37800]">
                          <Icon className="!size-[18px]" />
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-6 text-black/55">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            
          </div>

          
            <div className="mt-5 grid items-center gap-5 rounded-2xl border border-[#E0A800]/25 bg-[#FBF5E4] p-5 sm:p-6 lg:grid-cols-[auto_1fr]">
              <div className="flex items-baseline gap-2 lg:flex-col lg:items-center lg:gap-1">
                <p className="text-3xl font-black leading-none text-[#d99e00]">
                  {START.highlight.value}
                </p>
                <p className="text-[13px] font-bold text-[#1b2330]">{START.highlight.label}</p>
              </div>
              <p className="text-[13px] leading-7 text-black/60">{START.highlight.description}</p>
            </div>
          

          
            <div className="mt-8 flex flex-col items-center gap-4">
              <ul className="flex flex-wrap items-center justify-center gap-0">
                {START.timeline.map(({ Icon, label }, index) => (
                  <li key={label} className="flex items-center">
                    {index > 0 ? (
                      <span aria-hidden="true" className="mx-1 h-px w-8 bg-black/15 sm:mx-2" />
                    ) : null}
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex size-11 items-center justify-center rounded-2xl border border-black/[0.07] bg-white text-black/50 shadow-sm">
                        <Icon className="!size-[18px]" />
                      </span>
                      <span className="text-[11px] font-bold text-black/55">{label}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[13px] font-medium text-black/50">{START.timelineCaption}</p>
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {START.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[#E0A800]/30 bg-[#FBF5E4] px-4 py-1.5 text-[12px] font-bold text-[#8a6a00]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          
        </div>
      
    </Section>
  );
}
