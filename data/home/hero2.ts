import { ArrowLeft, Download, Play, type LucideIcon } from "lucide-react";

export const HERO2_CHARACTER = {
  baseSrc: "/hero/01.webp",
  gearSrc: "/hero/02.webp",
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
  highlight: "کمربند مشکی",
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
  Icon: Play,
};

export const HERO2_DOWNLOAD_CTA = {
  label: "دانلود اپلیکیشن",
  Icon: Download,
};

export interface Hero2FloatBadge {
  title: string;
  description: string;
}

export const HERO2_FLOAT_BADGE: Hero2FloatBadge = {
  title: "کمربند مشکی",
  description: "مسیر قهرمانی",
};
