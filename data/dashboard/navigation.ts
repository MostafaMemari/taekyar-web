import { FileText, FolderTree, LayoutDashboard, MessagesSquare, Tag as TagIcon } from "lucide-react";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "نمای کلی", Icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "مقالات", Icon: FileText },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", Icon: FolderTree },
  { href: "/dashboard/tags", label: "برچسب‌ها", Icon: TagIcon },
  { href: "/dashboard/comments", label: "دیدگاه‌ها", Icon: MessagesSquare },
];
