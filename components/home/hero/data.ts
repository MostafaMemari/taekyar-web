import { Flame, Footprints, Zap, type LucideIcon } from "lucide-react";

export interface Training {
  Icon: LucideIcon;
  title: string;
  meta: string;
  duration: string;
  tint: string;
}

export const BELT_LADDER = [
  "#ffffff",
  "#f4c430",
  "#2e8b57",
  "#1f5fa8",
  "#c21807",
  "#0d0d0d",
];

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

export const TRUST_BADGES = [
  "تأییدشده توسط مربیان",
  "به‌روزرسانی هفتگی",
  "پشتیبانی مستقیم",
];
