import { Activity, TrendingUp, Video, Zap, type LucideIcon } from "lucide-react";

export interface HomeFeature {
  Icon: LucideIcon;
  tint: string;
  title: string;
  description: string;
  progress?: { value: number; label: string };
}

export const FEATURES_INTRO = {
  eyebrow: "چرا تک‌یار؟",
  title: "هر آنچه برای پیشرفت لازم داری",
  description: "چهار ابزار ساده که تمرین را به عادت و پیشرفت را به نتیجه تبدیل می‌کند.",
};

export const FEATURE_CARDS: HomeFeature[] = [
  {
    Icon: Zap,
    tint: "bg-primary/10 text-primary",
    title: "تمرین شخصی‌سازی‌شده",
    description: "برنامه هفتگی متناسب با سطح، هدف و سرعت تو.",
  },
  {
    Icon: TrendingUp,
    tint: "bg-[#1f5fa8]/10 text-[#1f5fa8]",
    title: "مسیر کمربند هوشمند",
    description: "از سفید تا مشکی؛ همیشه بدان چقدر مانده.",
    progress: { value: 68, label: "۶۸٪ تا کمربند آبی" },
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
    description: "جلسات، دقایق و روزهای تمرینت در یک نگاه.",
  },
];
