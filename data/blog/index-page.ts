import { Compass, Newspaper, Salad, Target } from "lucide-react";

import type { BlogCategoryName } from "@/data/blog/categories";

export interface CategoryStyle {
  color: string;
  Icon: typeof Target;
}

export const CATEGORY_STYLES: Record<BlogCategoryName, CategoryStyle> = {
  "تکنیک‌ها": { color: "#1f5fa8", Icon: Target },
  "اخبار و مسابقات": { color: "#c21807", Icon: Newspaper },
  "تغذیه و تناسب اندام": { color: "#2e8b57", Icon: Salad },
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = { color: "#1f5fa8", Icon: Compass };

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category as BlogCategoryName] ?? DEFAULT_CATEGORY_STYLE;
}

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

