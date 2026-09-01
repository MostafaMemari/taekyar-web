import { FileText, FolderTree, Images, LayoutDashboard, MessagesSquare, Settings, Tag as TagIcon } from "lucide-react";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "نمای کلی", Icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "مقالات", Icon: FileText },
  { href: "/dashboard/media", label: "رسانه‌ها", Icon: Images },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", Icon: FolderTree },
  { href: "/dashboard/tags", label: "برچسب‌ها", Icon: TagIcon },
  { href: "/dashboard/comments", label: "دیدگاه‌ها", Icon: MessagesSquare },
  { href: "/dashboard/settings", label: "تنظیمات سایت", Icon: Settings },
];
