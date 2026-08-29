import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

export const OVERVIEW_LABELS = {
  title: "نمای کلی",
  description: "وضعیت محتوای تک‌یار در یک نگاه.",
  postsCount: "مقاله منتشرشده",
  approvedComments: "دیدگاه تأییدشده",
  pendingComments: "دیدگاه در انتظار بررسی",
  rejectedComments: "دیدگاه ردشده",
  pendingTitle: "دیدگاه‌های در انتظار بررسی",
  emptyPending: "دیدگاه جدیدی در صف بررسی نیست.",
  manageComments: "مدیریت دیدگاه‌ها",
  newPost: "مقاله جدید",
  recentPostsTitle: "آخرین مقاله‌ها",
  onPostSuffix: "روی مقاله:",
} as const;

export interface OverviewStatCard {
  key: "posts" | "approved" | "pending" | "rejected";
  label: string;
  icon: typeof FileText;
  tint: string;
  iconClass: string;
}

export const OVERVIEW_STAT_CARDS: OverviewStatCard[] = [
  {
    key: "posts",
    label: OVERVIEW_LABELS.postsCount,
    icon: FileText,
    tint: "border-t-belt-blue bg-belt-blue/[0.04]",
    iconClass: "bg-belt-blue/10 text-belt-blue ring-belt-blue/15",
  },
  {
    key: "approved",
    label: OVERVIEW_LABELS.approvedComments,
    icon: CheckCircle2,
    tint: "border-t-belt-green bg-belt-green/[0.04]",
    iconClass: "bg-belt-green/10 text-belt-green ring-belt-green/15",
  },
  {
    key: "pending",
    label: OVERVIEW_LABELS.pendingComments,
    icon: Clock3,
    tint: "border-t-belt-yellow bg-belt-yellow/[0.06]",
    iconClass: "bg-belt-yellow/15 text-belt-yellow-fg ring-belt-yellow/20",
  },
  {
    key: "rejected",
    label: OVERVIEW_LABELS.rejectedComments,
    icon: XCircle,
    tint: "border-t-belt-red bg-belt-red/[0.04]",
    iconClass: "bg-belt-red/10 text-belt-red ring-belt-red/15",
  },
];
