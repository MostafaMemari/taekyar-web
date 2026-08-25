import { Newspaper, Salad, Target } from "lucide-react";

import type { BlogCategoryName } from "@/lib/data";

export const BLOG_PREVIEW_COUNT = 3;

export const CATEGORY_STYLES: Record<
  BlogCategoryName,
  { color: string; Icon: typeof Target }
> = {
  "تکنیک‌ها": { color: "#1f5fa8", Icon: Target },
  "اخبار و مسابقات": { color: "#c21807", Icon: Newspaper },
  "تغذیه و تناسب اندام": { color: "#2e8b57", Icon: Salad },
};
