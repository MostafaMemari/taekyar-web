import { CalendarCheck, CirclePlay, Medal, MessagesSquare } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    Icon: CalendarCheck,
    title: "برنامه تمرین شخصی",
    description:
      "برنامه‌ای که با سطح، هدف و سرعت تو تنظیم می‌شود؛ هر هفته دقیقاً می‌دانی کدام تمرین، چند بار و برای کدام کمربند.",
  },
  {
    Icon: Medal,
    title: "پیگیری ارتقای کمربند",
    description:
      "مسیر پیشرفتت را از سفید تا سیاه ثبت کن؛ آمار تمرین‌ها و آمادگی‌ات برای آزمون بعدی همیشه جلوی چشمت باشد.",
  },
  {
    Icon: CirclePlay,
    title: "آموزش ویدیویی فن‌ها",
    description:
      "از ضربات پایه تا پومسه‌ها را فریم‌به‌فریم ببین؛ با اجرای استاندارد و توضیح ساده که در تمرین به کارت می‌آید.",
  },
  {
    Icon: MessagesSquare,
    title: "ارتباط با مربی",
    description:
      "سؤالت را از مربی بپرس، روی فن‌هایت بازخورد بگیری و تمرین‌هایت را زیر نظر مستقیم او انجام بده.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="max-w-xl">
            <span className="text-sm font-bold text-primary">چرا تک‌یار؟</span>
            <h2 className="mt-3 text-3xl font-black leading-snug sm:text-4xl">
              تمرین هوشمند، پیشرفت واقعی
            </h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست.
              هرچه برای رشد در تکواندو لازم داری، اینجا کنار هم است.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 90}>
              <Card className="h-full gap-3 bg-card transition-transform duration-300 hover:-translate-y-1">
                <CardHeader className="gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25">
                    <Icon className="!size-[22px]" />
                  </span>
                  <CardTitle className="text-base font-bold">{title}</CardTitle>
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
