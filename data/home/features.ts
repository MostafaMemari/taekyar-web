import { Activity, TrendingUp, Video, Zap, type LucideIcon } from "lucide-react";

export interface HomeFeature {
  Icon: LucideIcon;
  tint: string;
  title: string;
  description: string;
}

export const FEATURES_INTRO = {
  eyebrow: "چرا تک‌یار؟",
  title: "تمرینت را به مسیر تبدیل کن",
  description: "تک‌یار می‌گوید امروز چه تمرین کنی و نشان می‌دهد فردا کجایی.",
};

export const FEATURE_MAIN: HomeFeature = {
  Icon: Zap,
  tint: "bg-primary/10 text-primary",
  title: "تمرین شخصی‌سازی‌شده",
  description:
    "برنامه هفتگی که با سطح، هدف و سرعت تو تنظیم می‌شود؛ هر جلسه دقیقاً می‌دانی چه کنی.",
};

export const SUPPORTING_FEATURES: HomeFeature[] = [
  {
    Icon: TrendingUp,
    tint: "bg-primary/[0.07] text-primary",
    title: "مسیر کمربند هوشمند",
    description: "از سفید تا مشکی؛ همیشه بدان چقدر مانده.",
  },
  {
    Icon: Video,
    tint: "bg-primary/[0.07] text-primary",
    title: "آموزش ویدیویی فنون",
    description: "اجرای استاندارد ضربات و پومسه‌ها، فریم‌به‌فریم.",
  },
  {
    Icon: Activity,
    tint: "bg-primary/[0.07] text-primary",
    title: "داشبورد پیشرفت هفتگی",
    description: "جلسات و دقایق تمرینت در یک نگاه.",
  },
];
