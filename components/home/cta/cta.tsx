import { Download, Users } from "lucide-react";

import { CTA_CONTENT } from "@/data/home/cta";

export function CtaSection({ appDownloadUrl }: { appDownloadUrl?: string | null }) {
  const downloadHref = appDownloadUrl ?? "#download";

  return (
    <section id="download" className="relative isolate scroll-mt-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        
          <div className="relative overflow-hidden rounded-[28px] border border-[#E0A800]/20 bg-white px-5 py-14 text-center shadow-[0_30px_60px_-40px_rgba(154,109,0,0.45)] sm:px-8 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(224,168,0,0.28),transparent_70%)]"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
                {CTA_CONTENT.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-8 text-black/55 sm:leading-9">
                {CTA_CONTENT.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={downloadHref}
                  {...(appDownloadUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-7 text-[15px] font-extrabold text-[#2A1F00] shadow-[0_12px_26px_-10px_rgba(154,109,0,0.6)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Download className="!size-[18px]" />
                  {CTA_CONTENT.cta}
                </a>
                <a
                  href={CTA_CONTENT.secondary.href}
                  className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl border border-black/[0.09] bg-white px-6 text-[15px] font-bold text-[#1b2330] shadow-sm transition-colors duration-200 hover:border-[#E0A800]/50 hover:text-[#a37800]"
                >
                  <Users className="!size-[18px]" />
                  {CTA_CONTENT.secondary.label}
                </a>
              </div>

              <div className="mt-7">
                {CTA_CONTENT.note.map((line) => (
                  <p key={line} className="text-[12px] leading-6 text-black/45">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        
      </div>
    </section>
  );
}
