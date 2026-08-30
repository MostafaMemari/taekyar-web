import Link from "next/link";

import { BLOG_INDEX_LABELS } from "@/data/blog/index-page";
import { getCategories } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import type { BlogCategoryName } from "@/data/blog/categories";
import { cn } from "@/lib/utils";

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex shrink-0 snap-start items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4 sm:py-2",
        active
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/20 ring-1 ring-primary/20"
          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export async function CategoryFilter({
  activeCategory,
}: {
  activeCategory: BlogCategoryName | null;
}) {
  const categories = (await getCategories()).filter(
    (category) => category.parentId === null,
  );

  return (
    <nav
      aria-label={BLOG_INDEX_LABELS.filterNav}
      className="flex w-full items-center gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto sm:overflow-visible"
    >
      <div className="flex snap-x snap-mandatory items-center gap-2 py-1 pe-2 sm:pe-0">
        <FilterChip href="/blog" active={!activeCategory}>
          {BLOG_INDEX_LABELS.allCategories}
        </FilterChip>
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            href={categoryHref(category.path)}
            active={activeCategory === category.name}
          >
            {category.name}
          </FilterChip>
        ))}
      </div>
    </nav>
  );
}
