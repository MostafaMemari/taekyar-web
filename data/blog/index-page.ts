import { Newspaper, Salad, Target } from "lucide-react";

import type { BlogCategoryName } from "@/lib/blog";

export const CATEGORY_STYLES: Record<
  BlogCategoryName,
  { color: string; Icon: typeof Target }
> = {
  "تکنیک‌ها": { color: "#1f5fa8", Icon: Target },
  "اخبار و مسابقات": { color: "#c21807", Icon: Newspaper },
  "تغذیه و تناسب اندام": { color: "#2e8b57", Icon: Salad },
};

export const BLOG_INDEX_INTRO = {
  eyebrow: "وبلاگ تک‌یار",
  title: "مقالات و آموزش‌های تکواندو",
  description:
    "تحلیل فن‌ها، اخبار دنیای تکواندو و نکته‌های تغذیه و تناسب؛ هر هفته مطالبی که مستقیم از تشک تمرین به کارت می‌آید.",
};

export const BLOG_INDEX_LABELS = {
  filterNav: "فیلتر دسته‌بندی مقالات",
  allCategories: "همه",
  readMore: "ادامه مطلب",
  readTimeSuffix: "دقیقه مطالعه",
  emptyState:
    "هنوز مقاله‌ای در این دسته‌بندی منتشر نشده؛ به‌زودی مطالب جدید اضافه می‌شود.",
  resultsSuffix: "مقاله",
};

export const BLOG_PAGINATION = {
  postsPerPage: 4,
  navLabel: "ناوبری صفحات وبلاگ",
  prev: "صفحه قبل",
  next: "صفحه بعد",
  goTo: "رفتن به صفحه",
} as const;

