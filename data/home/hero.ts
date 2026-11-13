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

export const HERO_MASCOT = {
  training: {
    src: "/hero/01.webp",
    alt: "شخصیت تک‌یار با لباس تمرین و کمربند سفید",
  },
  sparring: {
    src: "/hero/02.webp",
    alt: "شخصیت تک‌یار با تجهیزات مسابقه، کلاه و محافظ سینه",
  },
};

export const HERO_BADGE = {
  value: "۶",
  label: "کمربند تا مشکی",
};
