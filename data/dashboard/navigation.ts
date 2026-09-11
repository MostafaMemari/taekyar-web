import type { ComponentType, SVGProps } from "react";
import {
  FileText,
  FolderTree,
  HelpCircle,
  Images,
  LayoutDashboard,
  ListTree,
  MessagesSquare,
  Plus,
  Settings,
  StickyNote,
  Tag as TagIcon,
} from "lucide-react";

export type DashboardNavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface DashboardNavItem {
  href: string;
  label: string;
  Icon: DashboardNavIcon;
  badgeKey?: "pendingComments";
  exact?: boolean;
}

export interface DashboardNavSection {
  label: string;
  items: DashboardNavItem[];
}

export const DASHBOARD_NAV_PRIMARY: DashboardNavItem = {
  href: "/dashboard",
  label: "نمای کلی",
  Icon: LayoutDashboard,
  exact: true,
};

export const DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    label: "محتوا",
    items: [
      { href: "/dashboard/posts", label: "مقالات", Icon: FileText },
      { href: "/dashboard/pages", label: "برگه‌ها", Icon: StickyNote },
      { href: "/dashboard/menus", label: "منوها", Icon: ListTree },
      { href: "/dashboard/media", label: "رسانه‌ها", Icon: Images },
    ],
  },
  {
    label: "ساختار و برچسب‌ها",
    items: [
      { href: "/dashboard/categories", label: "دسته‌بندی‌ها", Icon: FolderTree },
      { href: "/dashboard/tags", label: "برچسب‌ها", Icon: TagIcon },
    ],
  },
  {
    label: "تعامل کاربران",
    items: [
      { href: "/dashboard/comments", label: "دیدگاه‌ها", Icon: MessagesSquare, badgeKey: "pendingComments" },
      { href: "/dashboard/faqs", label: "سوالات متداول", Icon: HelpCircle },
    ],
  },
  {
    label: "سیستم",
    items: [{ href: "/dashboard/settings", label: "تنظیمات سایت", Icon: Settings }],
  },
];

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  DASHBOARD_NAV_PRIMARY,
  ...DASHBOARD_NAV_SECTIONS.flatMap((section) => section.items),
];

export const DASHBOARD_QUICK_ACTIONS: DashboardNavItem[] = [
  { href: "/dashboard/posts/new", label: "مقاله جدید", Icon: Plus },
  { href: "/dashboard/pages/new", label: "برگه جدید", Icon: Plus },
  { href: "/dashboard/categories/new", label: "دسته‌بندی جدید", Icon: Plus },
  { href: "/dashboard/tags/new", label: "برچسب جدید", Icon: Plus },
];

export const DASHBOARD_CREATE_LABELS: Record<string, string> = {
  posts: "مقاله جدید",
  pages: "برگه جدید",
  categories: "دسته‌بندی جدید",
  tags: "برچسب جدید",
};

export const DASHBOARD_ROUTE_LABELS = {
  new: "جدید",
  edit: "ویرایش",
  trash: "حذف‌شده‌ها",
  detail: "جزئیات",
} as const;

export function isDashboardNavItemActive(pathname: string, item: DashboardNavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
