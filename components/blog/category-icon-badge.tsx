import { getCategoryStyle } from "@/data/blog/index-page";
import { cn } from "@/lib/utils";

interface CategoryIconBadgeProps {
  category: string;
  className?: string;
  iconClassName?: string;
}

export function CategoryIconBadge({ category, className, iconClassName }: CategoryIconBadgeProps) {
  const { color, Icon } = getCategoryStyle(category);

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
