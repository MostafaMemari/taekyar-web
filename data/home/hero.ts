import { ArrowLeft, Download, Flame, Footprints, Zap, type LucideIcon } from "lucide-react";

import { BELT_LEVELS } from "@/data/shared/belts";

export interface Training {
  Icon: LucideIcon;
  title: string;
  meta: string;
  duration: string;
  tint: string;
}

export const BELT_COLORS = BELT_LEVELS.map(({ color }) => color);

export const TODAY_TRAININGS: Training[] = [
  {
    Icon: Flame,
    title: "گرم کردن و کشش",
    meta: "کشش پویا",
    duration: "۱۰ دقیقه",
    tint: "bg-[#f4c430]/20 text-[#9a7b0a]",
  },
  {
    Icon: Zap,
    title: "دولیو چاگی",
    meta: "ضربه پا",
    duration: "۱۵ دقیقه",
    tint: "bg-primary/10 text-primary",
  },
  {
    Icon: Footprints,
    title: "پومسه ایل جانگ",
    meta: "اجرای فرم",
    duration: "۱۲ دقیقه",
    tint: "bg-[#1f5fa8]/10 text-[#1f5fa8]",
  },
];

export const HERO_CHARACTER = {
  baseSrc: "/hero/01.webp",
  gearSrc: "/hero/02.webp",
  baseAlt: "تکواندوکار جوان با لباس سفید و کمربند سفید",
};

export const HERO_CONTENT = {
  eyebrow: "اعتماد به نفس، قدرت و انضباط را بساز",
  title: {
    line1: { prefix: "از", highlight: "اولین ضربه،" },
    line2: { prefix: "تا", highlight: "کمربند مشکی" },
  },
  description:
    "تک‌یار فقط یک برنامه تمرینی نیست؛ همراهی برای ساختن اعتماد به نفس، تقویت مهارت‌ها و رسیدن به هدف در مسیر تکواندو است.",
};

export const HERO_MICROCOPY = "دانلود و شروع، رایگان.";

export interface HeroCta {
  label: string;
  href: string;
  Icon: LucideIcon;
}

export const HERO_PRIMARY_CTA: HeroCta = {
  label: "دانلود اپلیکیشن",
  href: "#download",
  Icon: Download,
};

export const HERO_SECONDARY_CTA: HeroCta = {
  label: "مشاهده امکانات",
  href: "#features",
  Icon: ArrowLeft,
};

export interface HeroFloatBadge {
  title: string;
  description: string;
}

export const HERO_FLOAT_BADGE: HeroFloatBadge = {
  title: "کمربند مشکی",
  description: "مسیر قهرمانی",
};

export const HERO_APP_PREVIEW = {
  greeting: "سلام، مبارز!",
  weekTitle: "نمای هفته",
  beltLabel: "کمربند سبز",
  beltProgress: "۶۸٪ تا کمربند آبی",
  beltPercent: 68,
  weekDone: 3,
  weekTotal: 6,
  weekLabel: "از ۶ جلسه",
  nextLabel: "جلسه بعد",
  nextSession: "کیوروگی",
  nextTime: "امروز",
  startLabel: "شروع تمرین",
};
