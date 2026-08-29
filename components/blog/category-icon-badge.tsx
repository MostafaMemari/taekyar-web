import { Compass } from "lucide-react";

import { CATEGORY_STYLES } from "@/data/blog/index-page";
import type { BlogCategoryName } from "@/data/blog/categories";
import { cn } from "@/lib/utils";

interface CategoryIconBadgeProps {
  category: BlogCategoryName;
  className?: string;
  iconClassName?: string;
}

export function CategoryIconBadge({ category, className, iconClassName }: CategoryIconBadgeProps) {
  const style = CATEGORY_STYLES[category] ?? { color: "#1f5fa8", Icon: Compass };
  const { color, Icon } = style;

  return (
    <span
      aria-hidden="true"
      className={cn("flex shrink-0 items-center justify-center", className)}
      style={{ backgroundColor: `${color}14`, color }}
    >
      <Icon className={cn("size-4", iconClassName)} />
    </span>
  );
}
