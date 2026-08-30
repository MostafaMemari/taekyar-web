import Link from "next/link";

import { POST_LABELS } from "@/data/blog/post-config";
import { SidebarSection } from "@/components/blog/sidebar-section";
import { CategoryIconBadge } from "@/components/blog/category-icon-badge";
import type { PublicCategoryNode } from "@/lib/blog/categories";
import { getCategoryTree } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";

interface SidebarCategoriesProps {
  activeCategory?: string;
}

export async function SidebarCategories({ activeCategory }: SidebarCategoriesProps) {
  const categoryTree = await getCategoryTree();

  return (
    <SidebarSection title={POST_LABELS.categoriesTitle} icon={Compass}>
      <CategoryTreeList nodes={categoryTree} activePath={activeCategory} />
    </SidebarSection>
  );
}

function CategoryTreeList({ nodes, activePath }: { nodes: PublicCategoryNode[]; activePath?: string }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const active = node.path === activePath;

        return (
          <li key={node.id}>
            <Link
              href={categoryHref(node.path)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors",
                active
                  ? "bg-primary/[0.07]"
                  : "hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              )}
            >
              <CategoryIconBadge
                category={node.name}
                className="size-7 rounded-md"
                iconClassName="size-3.5"
              />
              <span
                className={cn(
                  "flex-1 text-[13px]",
                  active ? "font-bold text-primary" : "font-medium text-foreground"
                )}
              >
                {node.name}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                {node.postCount}
              </span>
            </Link>
            {node.children.length > 0 ? (
              <div className="ps-4">
                <CategoryTreeList nodes={node.children} activePath={activePath} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
