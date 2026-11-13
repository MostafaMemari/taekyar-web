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
  pendingHint: "دیدگاه‌هایی که پیش از انتشار نیاز به تأیید دارند",
  emptyPendingHint: "همه دیدگاه‌ها بررسی شده‌اند — مورد جدیدی در صف نیست.",
  recentPostsHint: "آخرین مقاله‌های منتشرشده — برای ویرایش سریع انتخاب کنید",
  emptyPosts: "هنوز مقاله‌ای نیست",
  emptyPostsHint: "اولین مقاله را بسازید تا اینجا نمایش داده شود.",
  viewAllPosts: "همه مقاله‌ها",
  activityTitle: "فعالیت دیدگاه‌ها",
  activityHint: "دیدگاه‌های ثبت‌شده در ۱۲ هفته اخیر",
  activityChartLabel: "نمودار ستونی دیدگاه‌های ۱۲ هفته اخیر",
  activityOldest: "۱۲ هفته پیش",
  activityNewest: "امروز",
  activityTotalSuffix: "دیدگاه",
} as const;

export type OverviewStatTone = "brand" | "warning" | "success" | "neutral";

export interface OverviewStatCard {
  key: "posts" | "approved" | "pending" | "rejected";
  label: string;
  icon: typeof FileText;
  tone: OverviewStatTone;
  href: string;
}

export const OVERVIEW_STAT_CARDS: OverviewStatCard[] = [
  {
    key: "posts",
    label: OVERVIEW_LABELS.postsCount,
    icon: FileText,
    tone: "brand",
    href: "/dashboard/posts",
  },
  {
    key: "approved",
    label: OVERVIEW_LABELS.approvedComments,
    icon: CheckCircle2,
    tone: "success",
    href: "/dashboard/comments?status=APPROVED",
  },
  {
    key: "pending",
    label: OVERVIEW_LABELS.pendingComments,
    icon: Clock3,
    tone: "warning",
    href: "/dashboard/comments?status=PENDING",
  },
  {
    key: "rejected",
    label: OVERVIEW_LABELS.rejectedComments,
    icon: XCircle,
    tone: "neutral",
    href: "/dashboard/comments?status=REJECTED",
  },
];

export const OVERVIEW_ACTIVITY_WEEKS = 12;
export const OVERVIEW_PENDING_LIMIT = 5;
export const OVERVIEW_RECENT_POSTS_LIMIT = 5;
