import type { BlogCategoryName } from "@/data/blog/categories";

export { blogCategories } from "@/data/blog/categories";
export type { BlogCategoryName } from "@/data/blog/categories";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryName;
  tags: string[];
  date: string;
  readTimeMinutes: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "dollyo-chagki-common-mistakes",
    title: "ده اشتباه رایج در ضربه دولیو چاگی و راه اصلاح آن‌ها",
    excerpt:
      "از چرخش ناکافی لگن تا فرود نامتعادل؛ اشتباهاتی که امتیاز را از شما می‌گیرند و تمرین‌های ساده‌ای که همین امروز می‌توانید برای اصلاحشان انجام دهید.",
    category: "تکنیک‌ها",
    tags: ["ضربات پا", "اصلاح فرم", "کیوروگی"],
    date: "۲۵ مرداد ۱۴۰۵",
    readTimeMinutes: 7,
  },
  {
    id: 3,
    slug: "olympic-rules-2026-changes",
    title: "قوانین جدید کیوروگی المپیک ۲۰۲۶؛ چه چیزی عوض می‌شود؟",
    excerpt:
      "سیستم امتیازدهی ضربات چرخشی و معیارهای داوری تغییر کرده است. مروری بر مقررات تازه و تأثیر آن بر تاکتیک‌های مبارزه شما.",
    category: "اخبار و مسابقات",
    tags: ["المپیک", "داوری", "کیوروگی"],
    date: "۱۰ مرداد ۱۴۰۵",
    readTimeMinutes: 5,
  },
  {
    id: 4,
    slug: "belt-test-week-nutrition-plan",
    title: "برنامه تغذیه هفته پایانی قبل از آزمون کمربند",
    excerpt:
      "چه بخورید تا روز آزمون پرانرژی باشید؟ برنامه غذایی ساده و خانگی همراه با نکته‌های آب‌رسانی و خواب برای عملکرد در بهترین حالت.",
    category: "تغذیه و تناسب اندام",
    tags: ["آزمون کمربند", "برنامه غذایی", "آب‌رسانی"],
    date: "۲ مرداد ۱۴۰۵",
    readTimeMinutes: 6,
  },
  {
    id: 2,
    slug: "poomsae-taeguk-one-guide",
    title: "پومسه تگوک ایل جانگ؛ راهنمای گام‌به‌گام برای مبتدی‌ها",
    excerpt:
      "اولین پومسه‌ای که برای کمربند زرد اجرا می‌کنید را حرکت‌به‌حرکت یاد بگیرید؛ با نکات مربیان درباره ریتم، نگاه و تنفس در هر فرم.",
    category: "تکنیک‌ها",
    tags: ["پومسه", "کمربند زرد", "مبتدی"],
    date: "۱۸ مرداد ۱۴۰۵",
    readTimeMinutes: 9,
  },
  {
    id: 5,
    slug: "home-flexibility-routine",
    title: "تمرین انعطاف‌پذیری در خانه؛ بدون هیچ تجهیزاتی",
    excerpt:
      "پانزده دقیقه حرکت کششی روزانه، بلندترین ضربه پا را به شما هدیه می‌دهد. برنامه کامل کشش برای ران، همسترینگ و مچ.",
    category: "تغذیه و تناسب اندام",
    tags: ["انعطاف‌پذیری", "تمرین در خانه", "کشش"],
    date: "۲۸ تیر ۱۴۰۵",
    readTimeMinutes: 8,
  },
  {
    id: 6,
    slug: "competition-mindset-stress-control",
    title: "ذهنیت قهرمانی؛ مدیریت استرس دقیقه‌های آخر قبل از مصافحه",
    excerpt:
      "تکنیک‌های تنفسی و تمرین‌های ذهنی که ورزشکاران حرفه‌ای برای آرام ماندن روی باسکول استفاده می‌کنند و شما هم می‌توانید.",
    category: "اخبار و مسابقات",
    tags: ["روانشناسی ورزش", "مسابقه", "تمرکز"],
    date: "۲۰ تیر ۱۴۰۵",
    readTimeMinutes: 6,
  },
];
