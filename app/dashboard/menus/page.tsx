import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import { MENUS_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { getMenuItemTargets } from "@/lib/admin/menu-targets";
import { MenuManager } from "@/components/dashboard/menus/menu-manager";
import type { MenuItemTypeDto, MenuLocationDto } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

export const metadata = { title: MENUS_LABELS.title };

const LOCATIONS: MenuLocationDto[] = ["HEADER_DESKTOP", "HEADER_MOBILE", "FOOTER_QUICK", "FOOTER_BLOG"];

interface MenusPageProps {
  searchParams: Promise<{ location?: string }>;
}

function parseLocation(value?: string): MenuLocationDto {
  return LOCATIONS.includes(value as MenuLocationDto) ? (value as MenuLocationDto) : "HEADER_DESKTOP";
}

export default async function DashboardMenusPage({ searchParams }: MenusPageProps) {
  const { location: rawLocation } = await searchParams;
  const location = parseLocation(rawLocation);

  const [rows, targets] = await Promise.all([
    prisma.menuItem.findMany({
      where: { location },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        type: true,
        pageId: true,
        postId: true,
        categoryId: true,
        tagId: true,
        customUrl: true,
        parentId: true,
        order: true,
      },
    }),
    getMenuItemTargets(),
  ]);

  const items = rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type as MenuItemTypeDto,
    pageId: row.pageId,
    postId: row.postId,
    categoryId: row.categoryId,
    tagId: row.tagId,
    customUrl: row.customUrl,
    parentId: row.parentId,
    order: row.order,
  }));

  return (
    <div className="space-y-5">
      <DashboardPageHeader title={MENUS_LABELS.title} description={MENUS_LABELS.description} />

      <nav
        aria-label={MENUS_LABELS.locationLabel}
        className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-1.5"
      >
        {LOCATIONS.map((value) => {
          const active = value === location;

          return (
            <Link
              key={value}
              href={`/dashboard/menus?location=${value}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center rounded-lg px-3 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {MENUS_LABELS.locations[value]}
            </Link>
          );
        })}
      </nav>

      <MenuManager location={location} items={items} targets={targets} />
    </div>
  );
}
