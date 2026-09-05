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

export type WeekDayState = "done" | "today" | "todo" | "rest";

export interface WeekStripDay {
  day: string;
  height: number;
  state: WeekDayState;
}

export const WEEK_STRIP_TITLE = "برنامه این هفته";

export const WEEK_STRIP_DAYS: WeekStripDay[] = [
  { day: "ش", height: 45, state: "done" },
  { day: "ی", height: 70, state: "done" },
  { day: "د", height: 35, state: "done" },
  { day: "س", height: 90, state: "today" },
  { day: "چ", height: 55, state: "todo" },
  { day: "پ", height: 65, state: "todo" },
  { day: "ج", height: 0, state: "rest" },
];

export const WEEK_STRIP_SUMMARY = {
  sessions: "۳ از ۶ جلسه",
  minutes: "۲۱۰ دقیقه تمرین",
};

export const SUPPORTING_FEATURES: HomeFeature[] = [
  {
    Icon: TrendingUp,
    tint: "bg-[#1f5fa8]/10 text-[#1f5fa8]",
    title: "مسیر کمربند هوشمند",
    description: "از سفید تا مشکی؛ همیشه بدان چقدر مانده.",
  },
  {
    Icon: Video,
    tint: "bg-[#2e8b57]/10 text-[#2e8b57]",
    title: "آموزش ویدیویی فنون",
    description: "اجرای استاندارد ضربات و پومسه‌ها، فریم‌به‌فریم.",
  },
  {
    Icon: Activity,
    tint: "bg-[#f4c430]/20 text-[#9a7b0a]",
    title: "داشبورد پیشرفت هفتگی",
    description: "جلسات و دقایق تمرینت در یک نگاه.",
  },
];
