import Link from "next/link";

import { CATEGORY_STYLES } from "@/data/blog/index-page";
import { POST_LABELS } from "@/data/blog/post-config";
import { SidebarSection } from "@/components/blog/sidebar-section";
import { blogCategories, type BlogCategoryName } from "@/data/blog/categories";
import { getBlogPosts } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";

interface SidebarCategoriesProps {
  activeCategory?: BlogCategoryName;
}

export async function SidebarCategories({ activeCategory }: SidebarCategoriesProps) {
  const posts = await getBlogPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }

  return (
    <SidebarSection title={POST_LABELS.categoriesTitle} icon={Compass}>
      <ul className="space-y-0.5">
        {blogCategories.map((category) => {
          const { color, Icon } = CATEGORY_STYLES[category];
          const active = category === activeCategory;

          return (
            <li key={category}>
              <Link
                href={`/blog?category=${encodeURIComponent(category)}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors",
                  active
                    ? "bg-primary/[0.07]"
                    : "hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${color}14`, color }}
                >
                  <Icon className="size-3.5" />
                </span>
                <span
                  className={cn(
                    "flex-1 text-[13px]",
                    active ? "font-bold text-primary" : "font-medium text-foreground"
                  )}
                >
                  {category}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                  {counts.get(category)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SidebarSection>
  );
}
