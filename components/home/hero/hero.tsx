import { toFaDigits } from "@/lib/utils";
import {
  BELT_PLATES,
  HERO_BADGE,
  HERO_BULLETS,
  HERO_CONTENT,
  HERO_PRIMARY_CTA,
  HERO_SECONDARY_CTA,
} from "@/data/home/hero";

interface HeroProps {
  appDownloadUrl?: string | null;
  postsCount: number;
  categoriesCount: number;
}

export function Hero({ appDownloadUrl, postsCount, categoriesCount }: HeroProps) {
  const downloadHref = appDownloadUrl ?? HERO_PRIMARY_CTA.href;
  const stats: Array<{ value: string; label: string }> = [
    { value: toFaDigits(postsCount), label: "مقاله" },
    { value: toFaDigits(categoriesCount), label: "دسته‌بندی‌ها" },
    { value: "۶", label: "کمربندها" },
    { value: "+۵۰۰", label: "ورزشکار" },
    { value: "+۲۰", label: "مربی" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(to_left,rgba(224,168,0,0.09),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_left,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6 lg:px-8 lg:pt-20">
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-start">
          <h1 className="text-balance text-[2.5rem] font-heading leading-[1.18] text-[#1b2330] sm:text-5xl sm:leading-[1.14] lg:text-[3.25rem] lg:leading-[1.12]">
            <span className="block">{HERO_CONTENT.title.line1}</span>
            <span className="block">{HERO_CONTENT.title.line2}</span>
            <span className="block text-[#d99e00]">{HERO_CONTENT.title.line3}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-[15px] leading-8 text-black/55 sm:text-base sm:leading-9">
            <strong className="font-extrabold text-[#c79500]">
              {HERO_CONTENT.descriptionLead}
            </strong>{" "}
            {HERO_CONTENT.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href={downloadHref}
              {...(appDownloadUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-7 text-[15px] font-extrabold text-[#2A1F00] shadow-[0_10px_24px_-10px_rgba(154,109,0,0.55)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <HERO_PRIMARY_CTA.Icon className="!size-[18px]" />
              {HERO_PRIMARY_CTA.label}
            </a>
            <a
              href={HERO_SECONDARY_CTA.href}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-[#1b2330] px-6 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-[#26304a]"
            >
              <HERO_SECONDARY_CTA.Icon className="!size-[18px]" />
              {HERO_SECONDARY_CTA.label}
            </a>
          </div>

          <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {HERO_BULLETS.map(({ Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-black/60"
              >
                <Icon aria-hidden="true" className="!size-4 shrink-0 text-[#d99e00]" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-fit origin-center scale-[0.82] sm:scale-100">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,168,0,0.16),transparent_62%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-2 left-1/2 w-4 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 shadow-[0_6px_14px_-6px_rgba(15,23,42,0.4)]"
            />
            <div className="relative flex flex-col-reverse items-center gap-2 sm:gap-2.5">
              {BELT_PLATES.map((plate) => (
                <div
                  key={plate.name}
                  style={{
                    width: plate.width,
                    backgroundColor: plate.color,
                    backgroundImage: plate.light
                      ? "linear-gradient(90deg, #ffffff 0%, #e2e8f0 100%)"
                      : `linear-gradient(90deg, color-mix(in srgb, ${plate.color} 78%, white) 0%, ${plate.color} 55%, color-mix(in srgb, ${plate.color} 82%, black) 100%)`,
                  }}
                  className="flex h-10 items-center justify-center rounded-full shadow-[0_18px_30px_-14px_rgba(15,23,42,0.35),inset_0_2px_6px_rgba(255,255,255,0.35),inset_-3px_0_8px_rgba(0,0,0,0.22)] sm:h-11"
                >
                  <span
                    className={
                      plate.light
                        ? "text-[11px] font-extrabold text-slate-500"
                        : "text-[11px] font-extrabold text-white/90"
                    }
                  >
                    {plate.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute -bottom-2 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/10 blur-xl" />

            <div className="absolute -top-8 end-0 rounded-2xl border border-black/[0.06] bg-white px-5 py-3 text-center shadow-[0_18px_40px_-18px_rgba(15,23,42,0.25)]">
              <p className="text-2xl font-black leading-none text-[#d99e00]">
                {HERO_BADGE.value}
              </p>
              <p className="mt-1.5 text-[11px] font-bold leading-5 text-black/60">
                {HERO_BADGE.label}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="rounded-[13px] border border-black/[0.09] bg-white px-4 py-4 text-center shadow-[0_10px_24px_-18px_rgba(15,23,42,0.25)]"
            >
              <span className="block text-[11px] font-medium text-black/50">{stat.label}</span>
              <span className="mt-1 block text-xl font-black tabular-nums text-[#1b2330]">
                {stat.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
