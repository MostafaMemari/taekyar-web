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
      <div>
        <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{MENUS_LABELS.title}</h1>
        <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
          {MENUS_LABELS.description}
        </p>
      </div>

      <nav aria-label={MENUS_LABELS.locationLabel} className="flex flex-wrap gap-2">
        {LOCATIONS.map((value) => (
          <a
            key={value}
            href={`/dashboard/menus?location=${value}`}
            aria-current={value === location ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-xl px-4 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              value === location
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-card text-muted-foreground ring-1 ring-border/60 hover:text-foreground",
            )}
          >
            {MENUS_LABELS.locations[value]}
          </a>
        ))}
      </nav>

      <MenuManager location={location} items={items} targets={targets} />
    </div>
  );
}
