import {
  ArrowLeft,
  CirclePlay,
  Download,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const HERO2_CHARACTER = {
  baseSrc: "/01.png",
  gearSrc: "/02.png",
  baseAlt: "تکواندوکار جوان با لباس سفید و کمربند سفید",
};

interface Hero2Cta {
  label: string;
  href: string;
  Icon: LucideIcon;
}

export const HERO2_EYEBROW = "اعتماد به نفس، قدرت و انضباط را بساز";

export const HERO2_TITLE = {
  line1: "از اولین ضربه،",
  line2Prefix: "تا",
  highlight: "کمربند سیاه",
};

export const HERO2_DESCRIPTION =
  "تک‌یار فقط یک برنامه تمرینی نیست؛ همراهی برای ساختن اعتماد به نفس، تقویت مهارت‌ها و رسیدن به هدف در مسیر تکواندو است.";

export const HERO2_PRIMARY_CTA: Hero2Cta = {
  label: "مشاهده کلاس‌ها",
  href: "#features",
  Icon: ArrowLeft,
};

export const HERO2_SECONDARY_CTA: Hero2Cta = {
  label: "تماشای ویدیو",
  href: "#download",
  Icon: CirclePlay,
};

export const HERO2_DOWNLOAD_CTA = {
  label: "دانلود اپلیکیشن",
  Icon: Download,
};

export interface Hero2Benefit {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const HERO2_BENEFITS: Hero2Benefit[] = [
  {
    title: "دفاع شخصی",
    description: "یادگیری مهارت‌های واقعی",
    Icon: ShieldCheck,
  },
  {
    title: "تناسب اندام",
    description: "فعال، سالم و پرانرژی",
    Icon: HeartPulse,
  },
  {
    title: "اعتماد به نفس",
    description: "بهترین نسخه خودت باش",
    Icon: Sparkles,
  },
];
