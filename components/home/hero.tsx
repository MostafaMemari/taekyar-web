import {
  Check,
  ChevronDown,
  Download,
  Dumbbell,
  Flame,
  Footprints,
  Home,
  Medal,
  Play,
  User,
  Users,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const BELT_LADDER = [
  "#ffffff",
  "#f4c430",
  "#2e8b57",
  "#1f5fa8",
  "#c21807",
  "#0d0d0d",
];

const TODAY_TRAININGS = [
  { Icon: Flame, title: "گرم کردن و کشش", meta: "کشش پویا", duration: "۱۰ دقیقه", tint: "bg-orange-500/10 text-orange-600" },
  { Icon: Zap, title: "دولیو چاگی", meta: "ضربه پا", duration: "۱۵ دقیقه", tint: "bg-primary/10 text-primary" },
  { Icon: Footprints, title: "پومسه ایل جانگ", meta: "اجرای فرم", duration: "۱۲ دقیقه", tint: "bg-[#1f5fa8]/10 text-[#1f5fa8]" },
];

const TRUST_BADGES = ["تأییدشده توسط مربیان", "به‌روزرسانی هفتگی", "پشتیبانی مستقیم"];

function StatCard({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: typeof Dumbbell;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5 rounded-2xl bg-card px-3.5 py-2.5 shadow-xl shadow-black/10 ring-1 ring-black/5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="!size-[18px]" />
        </span>
        <div>
          <p className="text-lg font-black leading-none text-foreground">
            <span dir="ltr">{value}</span>
          </p>
          <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-fit">
      {/* Soft glow behind the device */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_38%,rgba(224,40,46,0.14),rgba(224,40,46,0)_65%)] sm:-inset-16" />

      {/* Korean watermark */}
      <span className="absolute -end-14 top-1/2 hidden -translate-y-1/2 select-none font-black text-3xl tracking-[0.4em] text-foreground/[0.05] [writing-mode:vertical-rl] xl:block">
        태권도
      </span>

      {/* Device frame */}
      <div className="relative w-[264px] rounded-[2.6rem] bg-[#16161a] p-[10px] shadow-2xl shadow-black/25 ring-1 ring-black/30 sm:w-[290px]">
        <div className="overflow-hidden rounded-[2.1rem] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-bold text-black/70">
            <span>۹:۴۱</span>
            <span className="h-5 w-16 rounded-full bg-[#16161a]" />
            <span className="flex items-end gap-[3px]">
              <span className="h-1 w-[3px] rounded-full bg-black/50" />
              <span className="h-1.5 w-[3px] rounded-full bg-black/50" />
              <span className="h-2 w-[3px] rounded-full bg-black/50" />
              <span className="h-2.5 w-[3px] rounded-full bg-black/70" />
            </span>
          </div>

          <div className="space-y-3 px-4 pb-4 pt-3">
            {/* App header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-black/45">سلام، مبارز!</p>
                <p className="text-[13px] font-extrabold text-black">تمرین امروز</p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <User className="size-4" />
              </span>
            </div>

            {/* Belt progress module */}
            <div className="rounded-2xl bg-[#fafaf8] p-3 ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-black/60">مسیر کمربند</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                  ۶۸٪ تا کمربند آبی
                </span>
              </div>
              <div className="relative mt-3">
                <div className="flex h-2.5 gap-[3px] rounded-full bg-black/[0.06] p-[2px]">
                  {BELT_LADDER.map((color) => (
                    <span key={color} className="h-full flex-1 rounded-[3px]" style={{ background: color }} />
                  ))}
                </div>
                <span
                  className="absolute -top-[3px] size-2 rounded-full bg-primary shadow-md ring-2 ring-white"
                  style={{ insetInlineStart: "calc(52% - 4px)" }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[9px] font-medium text-black/35">
                <span>سفید</span>
                <span>سیاه</span>
              </div>
            </div>

            {/* Today's trainings */}
            <p className="text-[11px] font-bold text-black/60">تمرین‌های امروز</p>
            <div className="space-y-2">
              {TODAY_TRAININGS.map(({ Icon, title, meta, duration, tint }) => (
                <div key={title} className="flex items-center gap-2.5 rounded-xl bg-[#fafaf8] p-2.5 ring-1 ring-black/5">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tint}`}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-black">{title}</p>
                    <p className="mt-0.5 text-[9px] text-black/40">{meta}</p>
                  </div>
                  <span className="shrink-0 text-[9px] font-semibold text-black/40">{duration}</span>
                </div>
              ))}
            </div>

            {/* Start button */}
            <div className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-[11px] font-bold text-white shadow-md shadow-primary/30">
              <Play className="size-3 fill-current" />
              شروع تمرین
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center justify-around border-t border-black/5 px-6 py-2.5 text-black/30">
            <Home className="size-4 text-primary" />
            <Dumbbell className="size-4" />
            <User className="size-4" />
          </div>
        </div>
      </div>

      {/* Floating stat cards */}
      <StatCard
        icon={Dumbbell}
        value="۵۰+"
        label="فن آموزشی"
        className="absolute -top-6 end-2 animate-hero-float sm:-end-10"
      />
      <StatCard
        icon={Users}
        value="۱۰۰۰+"
        label="تمرین‌کننده فعال"
        className="absolute -bottom-8 -start-2 hidden animate-hero-float [animation-delay:-3s] sm:block sm:-start-12"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="theme-light relative isolate min-h-fit overflow-hidden bg-background text-foreground">
      {/* Light backdrop layers */}
      <div aria-hidden="true" className="bg-weave-light pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_85%_-10%,rgba(224,40,46,0.07),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_5%_115%,rgba(224,40,46,0.05),transparent_55%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-24 pt-12 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-20 lg:pt-16">
        <Reveal>
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
              <Medal className="size-3.5 text-primary" />
              همراه هوشمند تمرین تکواندو
            </span>

            {/* Headline */}
            <h1 className="mt-5 max-w-2xl text-[2.4rem] font-black leading-[1.25] sm:text-6xl sm:leading-[1.15] lg:text-[4.35rem] lg:leading-[1.12]">
              <span className="block">از اولین ضربه،</span>
              <span className="block">
                تا{" "}
                <span className="bg-gradient-to-l from-[#f04a4f] via-primary to-[#8f1216] bg-clip-text text-transparent">
                  کمربند سیاه.
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-lg text-[15px] leading-8 text-muted-foreground sm:text-base sm:leading-9">
              تک‌یار همراه هوشمند تو در دنیای تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها
              و پیگیری دقیق مسیر ارتقای کمربند — همه در یک اپلیکیشن.
            </p>

            {/* Actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                className="h-12 gap-2 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                <Download className="!size-[18px]" />
                دانلود اپلیکیشن
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-xl border-border bg-card px-6 text-[15px] font-bold text-foreground shadow-sm hover:bg-muted dark:border-border dark:bg-card dark:hover:bg-muted"
              >
                <a href="#features">مشاهده امکانات</a>
              </Button>
            </div>

            {/* Trust badges */}
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-belt-green/15 text-belt-green">
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <PhoneMockup />
        </Reveal>
      </div>

      {/* Scroll cue */}
      <a
        href="#features"
        aria-label="رفتن به بخش امکانات"
        className="group absolute bottom-4 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ChevronDown className="size-4 animate-scroll-cue" />
      </a>
    </section>
  );
}
