import { Flame, Footprints, Zap, type LucideIcon } from "lucide-react";

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

export const HERO_COPY = {
  eyebrow: "اپلیکیشن تک‌یار",
  titleLine1: "پیشرفتت را",
  titleLine2: "هفته‌به‌هفته ببین",
  description:
    "برنامه تمرین شخصی، ثبت جلسات و مسیر کمربند — همه در یک اپ، زیر نظر مربی.",
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
