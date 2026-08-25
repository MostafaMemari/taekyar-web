import Link from "next/link";

import { BLOG_INDEX_LABELS } from "@/components/blog/data";
import { blogCategories, type BlogCategoryName } from "@/lib/blog";
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
        "inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function CategoryFilter({
  activeCategory,
}: {
  activeCategory: BlogCategoryName | null;
}) {
  return (
    <nav
      aria-label={BLOG_INDEX_LABELS.filterNav}
      className="flex flex-wrap items-center gap-2"
    >
      <FilterChip href="/blog" active={!activeCategory}>
        {BLOG_INDEX_LABELS.allCategories}
      </FilterChip>
      {blogCategories.map((name) => (
        <FilterChip
          key={name}
          href={`/blog?category=${encodeURIComponent(name)}`}
          active={activeCategory === name}
        >
          {name}
        </FilterChip>
      ))}
    </nav>
  );
}
