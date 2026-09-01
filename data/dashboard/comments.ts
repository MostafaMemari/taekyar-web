import type { CommentStatus } from "@/lib/admin-types";

export const COMMENTS_ADMIN_LABELS = {
  title: "مدیریت دیدگاه‌ها",
  description: "بررسی، تأیید یا رد دیدگاه‌های کاربران.",
  filterAll: "همه",
  replyTag: "پاسخ",
  onPost: "روی مقاله",
  empty: "دیدگاهی یافت نشد.",
  approve: "تأیید",
  reject: "رد",
  delete: "حذف",
  approved: "دیدگاه تأیید شد.",
  rejected: "دیدگاه رد شد.",
  deleted: "دیدگاه حذف شد.",
  error: "انجام نشد.",
  confirmDelete: "این دیدگاه حذف شود؟",
  repliesLabel: "پاسخ‌ها",
  prevPage: "صفحه قبل",
  nextPage: "صفحه بعد",
  pageInfoSuffix: "صفحه",
  resultsSuffix: "دیدگاه",
} as const;

export const COMMENT_STATUS_META: Record<CommentStatus, { label: string; badgeClassName: string }> = {
  PENDING: {
    label: "در انتظار بررسی",
    badgeClassName: "bg-belt-yellow/20 text-belt-yellow-fg ring-belt-yellow/40",
  },
  APPROVED: {
    label: "تأییدشده",
    badgeClassName: "bg-belt-green/15 text-belt-green ring-belt-green/25",
  },
  REJECTED: {
    label: "ردشده",
    badgeClassName: "bg-belt-red/10 text-belt-red ring-belt-red/20",
  },
};
