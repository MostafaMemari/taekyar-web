import { MessageCircle, TrendingUp, Video, Zap } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { Reveal } from "@/components/reveal";

const CARD_BASE =
  "h-full rounded-2xl bg-card p-5 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.07] sm:p-6";

const FEATURES = [
  {
    Icon: TrendingUp,
    tint: "bg-[#1f5fa8]/10 text-[#1f5fa8]",
    title: "پیگیری ارتقای کمربند",
    description:
      "مسیر پیشرفتت را از سفید تا سیاه ثبت کن؛ آمار تمرین‌ها و آمادگی‌ات برای آزمون بعدی همیشه جلوی چشمت باشد.",
  },
  {
    Icon: Video,
    tint: "bg-[#2e8b57]/10 text-[#2e8b57]",
    title: "آموزش ویدیویی فن‌ها",
    description:
      "از ضربات پایه تا پومسه‌ها را فریم‌به‌فریم ببین؛ با اجرای استاندارد و توضیح ساده که در تمرین به کارت می‌آید.",
  },
  {
    Icon: MessageCircle,
    tint: "bg-[#f4c430]/20 text-[#9a7b0a]",
    title: "ارتباط با مربی",
    description:
      "سؤالت را از مربی بپرس، روی فن‌هایت بازخورد بگیری و تمرین‌هایت را زیر نظر مستقیم او انجام بده.",
  },
];

const PLAN_CHIPS = ["سطح‌بندی خودکار", "برنامهٔ هفتگی", "تمرین در خانه یا باشگاه"];

export function Features() {
  return (
    <section id="features" className="theme-light relative isolate scroll-mt-24 bg-[#f5f5f4] text-foreground">
      {/* Tatami lattice texture */}
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-bold text-primary">چرا تک‌یار؟</span>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.45] sm:text-4xl sm:leading-[1.4]">
              تمرین هوشمند، پیشرفت واقعی
            </h2>
            <BeltDivider fullWidth={false} variant="pill" className="mt-4 h-1 w-20" />
            <p className="mt-4 text-[15px] font-normal leading-8 text-muted-foreground sm:text-base sm:leading-9">
              تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست. هرچه برای رشد در
              تکواندو لازم داری، اینجا کنار هم است.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {/* Featured card — wider on desktop */}
          <Reveal className="sm:col-span-2">
            <article className={`${CARD_BASE} lg:flex lg:items-center lg:gap-7 lg:p-7`}>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                <Zap className="!size-6" />
              </span>
              <div className="mt-4 lg:mt-0">
                <h3 className="text-lg font-extrabold sm:text-xl">برنامه تمرین شخصی</h3>
                <p className="mt-2 text-sm font-normal leading-8 text-muted-foreground">
                  برنامه‌ای که با سطح، هدف و سرعت تو تنظیم می‌شود؛ هر هفته دقیقاً می‌دانی کدام
                  تمرین، چند بار و برای کدام کمربند.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {PLAN_CHIPS.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>

          {FEATURES.map(({ Icon, tint, title, description }, index) => (
            <Reveal key={title} delay={(index + 1) * 80}>
              <article className={CARD_BASE}>
                <span className={`flex size-11 items-center justify-center rounded-full ${tint}`}>
                  <Icon className="!size-5" />
                </span>
                <h3 className="mt-3.5 text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm font-normal leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
