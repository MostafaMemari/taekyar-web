import { Section } from "@/components/shared/section";
import { ROADMAP } from "@/data/home/landing";

export function Roadmap() {
  return (
    <Section tone="default" className="bg-[#f5f1ea]">
      
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
            {ROADMAP.title}
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-8 text-black/55">
            {ROADMAP.description}
          </p>
        </div>
      

      <ul className="mt-10 grid gap-4 lg:grid-cols-2">
        {ROADMAP.items.map(({ badge, Icon, title, description }) => (
          <li key={title}>
            
              <div className="h-full rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)] sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-sm font-black text-[#2A1F00] shadow-[0_6px_14px_-6px_rgba(154,109,0,0.6)]">
                    {badge}
                  </span>
                  <h3 className="flex-1 text-[15px] font-extrabold text-[#1b2330] sm:text-base">
                    {title}
                  </h3>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E0A800]/12 text-[#a37800]">
                    <Icon className="!size-[18px]" />
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-7 text-black/55">{description}</p>
              </div>
            
          </li>
        ))}
      </ul>

      
        <div className="mt-5 rounded-3xl border border-[#E0A800]/25 bg-gradient-to-bl from-[#FDF6E1] to-[#F9EDCB] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-[#2A1F00] shadow-[0_8px_18px_-8px_rgba(154,109,0,0.7)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-[#1b2330]">{ROADMAP.note.title}</h3>
              <p className="mt-2 text-pretty text-[13px] leading-8 text-black/60 sm:text-sm">
                {ROADMAP.note.description}
              </p>
              <p className="mt-4 text-[12px] font-medium text-black/45">{ROADMAP.note.caption}</p>
            </div>
          </div>
        </div>
      
    </Section>
  );
}
