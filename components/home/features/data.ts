import {
  Dumbbell,
  Flame,
  Footprints,
  MessageCircle,
  Moon,
  Swords,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";

export interface SupportingFeature {
  Icon: typeof Zap;
  tint: string;
  title: string;
  description: string;
}

export const FEATURES_INTRO = {
  eyebrow: "چرا تک‌یار؟",
  title: "تمرین هوشمند، پیشرفت واقعی",
  description:
    "تک‌یار فقط یک اپلیکیشن ورزشی نیست؛ باشگاه همراه همیشگی توست. هرچه برای رشد در تکواندو لازم داری، اینجا کنار هم است.",
};

export const FEATURED_FEATURE = {
  Icon: Zap,
  title: "برنامه تمرین شخصی",
  description:
    "برنامه‌ای که با سطح، هدف و سرعت تو تنظیم می‌شود؛ هر هفته دقیقاً می‌دانی کدام تمرین، چند بار و برای کدام کمربند.",
};

export const PLAN_CHIPS = [
  "سطح‌بندی خودکار",
  "برنامهٔ هفتگی",
  "تمرین در خانه یا باشگاه",
];

export const WEEKLY_PLAN = [
  { day: "ش", label: "پایه", Icon: Footprints, load: 55, minutes: 30, done: true },
  { day: "ی", label: "ضربات", Icon: Zap, load: 80, minutes: 45, done: true },
  { day: "د", label: "کشش", Icon: Flame, load: 35, minutes: 20, done: true },
  { day: "س", label: "کیوروگی", Icon: Swords, load: 95, minutes: 50, active: true },
  { day: "چ", label: "پومسه", Icon: Footprints, load: 45, minutes: 25 },
  { day: "پ", label: "قدرت", Icon: Dumbbell, load: 70, minutes: 40 },
  { day: "ج", label: "استراحت", Icon: Moon, load: 0, minutes: 0, rest: true },
];

export const WEEKLY_STATS = [
  { label: "جلسه فعال", value: "۶" },
  { label: "دقیقه تمرین", value: "۲۱۰" },
  { label: "تکمیل‌شده", value: "۳ از ۶" },
];

export const SUPPORTING_FEATURES: SupportingFeature[] = [
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

export const BELT_PATH = [
  { name: "سفید", color: "#ffffff" },
  { name: "زرد", color: "#f4c430" },
  { name: "سبز", color: "#2e8b57" },
  { name: "آبی", color: "#1f5fa8" },
  { name: "قرمز", color: "#c21807" },
  { name: "سیاه", color: "#0d0d0d" },
];

export const CURRENT_BELT_INDEX = 2;
