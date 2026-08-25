import { MessageCircle, TrendingUp, Video, Zap } from "lucide-react";

export interface Feature {
  Icon: typeof Zap;
  tint: string;
  title: string;
  description: string;
}

export const FEATURED_FEATURE = {
  Icon: Zap,
  tint: "bg-primary/10 text-primary",
  title: "برنامه تمرین شخصی",
  description:
    "برنامه‌ای که با سطح، هدف و سرعت تو تنظیم می‌شود؛ هر هفته دقیقاً می‌دانی کدام تمرین، چند بار و برای کدام کمربند.",
};

export const FEATURES: Feature[] = [
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

export const PLAN_CHIPS = [
  "سطح‌بندی خودکار",
  "برنامهٔ هفتگی",
  "تمرین در خانه یا باشگاه",
];
