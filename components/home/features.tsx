import { Target, TrendingUp, Users, Zap } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    Icon: Zap,
    title: "برنامه تمرین شخصی",
    description:
      "برنامه‌ای که با سطح، هدف و سرعت تو تنظیم می‌شود؛ هر هفته دقیقاً می‌دانی کدام تمرین، چند بار و برای کدام کمربند.",
  },
  {
    Icon: TrendingUp,
    title: "پیگیری ارتقای کمربند",
    description:
      "مسیر پیشرفتت را از سفید تا سیاه ثبت کن؛ آمار تمرین‌ها و آمادگی‌ات برای آزمون بعدی همیشه جلوی چشمت باشد.",
  },
  {
    Icon: Target,
    title: "آموزش ویدیویی فن‌ها",
    description:
      "از ضربات پایه تا پومسه‌ها را فریم‌به‌فریم ببین؛ با اجرای استاندارد و توضیح ساده که در تمرین به کارت می‌آید.",
  },
  {
    Icon: Users,
    title: "ارتباط با مربی",
    description:
      "سؤالت را از مربی بپرس، روی فن‌هایت بازخورد بگیری و تمرین‌هایت را زیر نظر مستقیم او انجام بده.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-bold text-primary">چرا تک‌یار؟</span>
            <h2 className="mt-2 text-3xl font-black leading-snug sm:text-4xl">
              تمرین هوشمند، پیشرفت واقعی
            </h2>
            <BeltDivider
              fullWidth={false}
              variant="pill"
              className="mt-3 h-1 w-20"
            />
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8">
              تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست.
              هرچه برای رشد در تکواندو لازم داری، اینجا کنار هم است.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 80}>
              <Card className="group h-full gap-2.5 bg-gradient-to-b from-card to-[#141414] ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50 hover:ring-primary/40">
                <CardHeader className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 transition-colors group-hover:bg-primary/20">
                    <Icon className="!size-[18px]" />
                  </span>
                  <CardTitle className="text-[15px] font-bold leading-6">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {description}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
