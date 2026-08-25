import { Reveal } from "@/components/reveal";
import { DownloadButtons } from "@/components/download-buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StrikeArt() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_58%_45%,rgba(224,40,46,0.16),rgba(224,40,46,0)_62%)]" />
      <svg
        viewBox="0 0 560 560"
        fill="none"
        className="relative h-full w-full"
        role="presentation"
      >
        <defs>
          <linearGradient id="strike-gradient" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#b01d22" />
            <stop offset="55%" stopColor="#e0282e" />
            <stop offset="100%" stopColor="#f04a4f" />
          </linearGradient>
        </defs>

        <circle cx="280" cy="300" r="205" stroke="rgba(245,243,239,0.05)" strokeWidth="1.5" />

        <g className="speed-line" stroke="#e0282e" strokeLinecap="butt">
          <line x1="428" y1="248" x2="520" y2="301" strokeWidth="2.5" opacity="0.3" />
          <line x1="330" y1="300" x2="452" y2="370" strokeWidth="3" opacity="0.38" />
          <line x1="298" y1="352" x2="468" y2="451" strokeWidth="6" opacity="0.6" />
          <line x1="362" y1="410" x2="502" y2="491" strokeWidth="9" opacity="0.8" />
          <line x1="252" y1="420" x2="362" y2="484" strokeWidth="4" opacity="0.46" />
          <line x1="196" y1="452" x2="286" y2="504" strokeWidth="2.5" opacity="0.3" />
        </g>

        <path
          className="strike-draw"
          d="M505 468 C 492 318, 396 172, 168 122"
          stroke="url(#strike-gradient)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        <rect
          x="-11"
          y="-11"
          width="22"
          height="22"
          transform="translate(168 122) rotate(45)"
          fill="#f5f3ef"
        />
        <rect
          x="-7"
          y="-7"
          width="14"
          height="14"
          transform="translate(214 96) rotate(45)"
          fill="#e0282e"
          opacity="0.55"
        />
        <rect
          x="-5"
          y="-5"
          width="10"
          height="10"
          transform="translate(132 152) rotate(45)"
          fill="#e0282e"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-24">
        <Reveal>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
              اپلیکیشن همراه تمرین تکواندو
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.35] tracking-tight sm:text-5xl lg:text-[3.3rem] lg:leading-[1.3]">
              ضربه بزن. پیشرفت کن.{" "}
              <span className="text-primary">کمربند عوض کن.</span>
            </h1>

            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
              تک‌یار همراه هوشمند تو در دنیای تکواندوست؛ برنامه تمرین شخصی،
              آموزش گام‌به‌گام فن‌ها و پیگیری دقیق مسیر ارتقای کمربند — همه در
              یک اپلیکیشن.
            </p>

            <DownloadButtons className="mt-9" tone="dark" />

            <Button
              asChild
              variant="link"
              className="mt-5 h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
            >
              <Link href="/#features">امکانات اپلیکیشن را ببینید</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <StrikeArt />
        </Reveal>
      </div>
    </section>
  );
}
