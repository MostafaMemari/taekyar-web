import { ClipboardList, Play, ShieldCheck, Tag, type LucideIcon } from "lucide-react";

export const HERO_CONTENT = {
  title: {
    line1: "تک‌یار، کامل‌ترین",
    line2: "همراه تمرین",
    line3: "تکواندو",
  },
  descriptionLead: "تکواندو",
  description:
    "یعنی ساختن بدن و ذهن با سه چیز: تمرین منظم، فرم درست و استمرار. هر سه را همین‌جا از صفر یاد می‌گیری. مقالات آموزشی، برنامه هفتگی شخصی‌سازی‌شده و مسیر کمربند از سفید تا مشکی. رایگان و بدون عضویت.",
};

export interface HeroBullet {
  Icon: LucideIcon;
  label: string;
}

export const HERO_BULLETS: HeroBullet[] = [
  { Icon: Tag, label: "رایگان و بدون عضویت" },
  { Icon: Play, label: "فن‌ها با آموزش ویدیویی" },
  { Icon: ClipboardList, label: "۶ کمربند، دسته‌بندی‌شده" },
  { Icon: ShieldCheck, label: "بازخورد مستقیم مربی" },
];

export interface HeroCta {
  label: string;
  href: string;
  Icon: LucideIcon;
}

export const HERO_PRIMARY_CTA: HeroCta = {
  label: "برنامه تمرین بگیر",
  href: "#download",
  Icon: ClipboardList,
};

export const HERO_SECONDARY_CTA: HeroCta = {
  label: "کمربندها را ببین",
  href: "#belts",
  Icon: Play,
};

export interface BeltPlate {
  name: string;
  color: string;
  width: number;
  light?: boolean;
}

export const BELT_PLATES: BeltPlate[] = [
  { name: "سفید", color: "#e2e8f0", width: 120, light: true },
  { name: "زرد", color: "#f4c430", width: 170 },
  { name: "سبز", color: "#2e8b57", width: 216 },
  { name: "آبی", color: "#1f5fa8", width: 260 },
  { name: "قرمز", color: "#c21807", width: 292 },
  { name: "مشکی", color: "#0d0d0d", width: 320 },
];

export const HERO_BADGE = {
  value: "۶",
  label: "کمربند تا مشکی",
};
