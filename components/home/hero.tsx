import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { DownloadButtons } from "@/components/download-buttons";
import { Button } from "@/components/ui/button";

function KickArt() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[380px] lg:max-w-none"
    >
      {/* Korean watermark — 태권도 */}
      <span className="absolute -end-1 top-1/2 hidden -translate-y-1/2 select-none font-black text-2xl tracking-[0.4em] text-foreground/[0.07] [writing-mode:vertical-rl] xl:block">
        태권도
      </span>

      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_55%_42%,rgba(224,40,46,0.22),rgba(224,40,46,0)_64%)]" />

      <svg
        viewBox="0 0 560 560"
        fill="none"
        className="relative h-full w-full"
        role="presentation"
      >
        <defs>
          <linearGradient
            id="figure-gradient"
            gradientUnits="userSpaceOnUse"
            x1="160"
            y1="110"
            x2="400"
            y2="480"
          >
            <stop offset="0%" stopColor="#f04a4f" />
            <stop offset="45%" stopColor="#e0282e" />
            <stop offset="100%" stopColor="#8f1216" />
          </linearGradient>
          <linearGradient
            id="ring-gradient"
            gradientUnits="userSpaceOnUse"
            x1="60"
            y1="500"
            x2="500"
            y2="240"
          >
            <stop offset="0%" stopColor="#b01d22" />
            <stop offset="55%" stopColor="#e0282e" />
            <stop offset="100%" stopColor="#f04a4f" />
          </linearGradient>
        </defs>

        {/* Taegeuk-inspired ring: thin circle + drawn red arc + yin/yang dots */}
        <circle
          cx="280"
          cy="280"
          r="225"
          stroke="rgba(245,243,239,0.08)"
          strokeWidth="1.5"
        />
        <path
          className="strike-draw"
          d="M 69 357 A 225 225 0 0 0 492 357"
          stroke="url(#ring-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="280" cy="55" r="10" fill="#e0282e" opacity="0.75" />
        <circle cx="439" cy="439" r="8" fill="#f5f3ef" opacity="0.45" />

        {/* Speed trails behind the kick */}
        <g className="speed-line" stroke="#e0282e" strokeLinecap="butt">
          <line x1="300" y1="306" x2="388" y2="256" strokeWidth="2.5" opacity="0.3" />
          <line x1="318" y1="262" x2="430" y2="196" strokeWidth="4" opacity="0.45" />
          <line x1="350" y1="292" x2="478" y2="220" strokeWidth="7" opacity="0.65" />
        </g>

        {/* Kicking figure */}
        <g className="animate-hero-float" stroke="url(#figure-gradient)" strokeLinecap="round" strokeLinejoin="round">
          {/* rear arm */}
          <path d="M230 218 L182 254 L170 300" strokeWidth="17" fill="none" />
          {/* support leg */}
          <path d="M268 294 L248 394 L260 472" strokeWidth="21" fill="none" />
          <line x1="260" y1="472" x2="296" y2="482" strokeWidth="13" />
          {/* torso */}
          <path d="M222 178 L270 296" strokeWidth="46" fill="none" />
          {/* guard arm */}
          <path d="M238 212 L292 228 L314 184" strokeWidth="17" fill="none" />
          {/* kicking leg */}
          <path d="M268 294 L352 232 L472 150" strokeWidth="21" fill="none" />
          <line x1="472" y1="150" x2="512" y2="128" strokeWidth="12" />
          {/* belt */}
          <line x1="236" y1="289" x2="292" y2="267" stroke="#f5f3ef" strokeWidth="13" />
          {/* head */}
          <circle cx="204" cy="138" r="30" fill="url(#figure-gradient)" stroke="none" />
        </g>

        {/* Impact spark at the foot */}
        <g stroke="#f5f3ef" strokeLinecap="round" opacity="0.85">
          <line x1="522" y1="114" x2="536" y2="102" strokeWidth="3" />
          <line x1="528" y1="132" x2="546" y2="134" strokeWidth="3" />
          <line x1="512" y1="104" x2="518" y2="88" strokeWidth="2.5" opacity="0.6" />
        </g>
        <rect
          x="-9"
          y="-9"
          width="18"
          height="18"
          transform="translate(516 122) rotate(45)"
          fill="#e0282e"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <div aria-hidden="true" className="bg-weave pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_-10%,rgba(224,40,46,0.15),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_112%,rgba(224,40,46,0.09),transparent_50%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-10">
        <Reveal>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                اپلیکیشن همراه تمرین تکواندو
              </span>
              <span
                lang="ko"
                className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold tracking-[0.25em] text-primary"
              >
                태권도
              </span>
            </div>

            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl sm:leading-[1.06] lg:text-[4.4rem] lg:leading-[1.05]">
              <span className="block">ضربه بزن.</span>
              <span className="block">پیشرفت کن.</span>
              <span className="text-glow-red mt-1 block text-primary">
                کمربند عوض کن.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
              تک‌یار همراه هوشمند تو در دنیای تکواندوست؛ برنامه تمرین شخصی،
              آموزش گام‌به‌گام فن‌ها و پیگیری دقیق مسیر ارتقای کمربند — همه در
              یک اپلیکیشن.
            </p>

            <div className="relative mt-7 w-fit">
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-2xl bg-primary/25 blur-xl"
              />
              <DownloadButtons className="relative" tone="dark" />
            </div>

            <Button
              asChild
              variant="link"
              className="mt-4 h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
            >
              <Link href="/#features">امکانات اپلیکیشن را ببینید</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <KickArt />
        </Reveal>
      </div>
    </section>
  );
}
