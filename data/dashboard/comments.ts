import type { CommentStatus } from "@/lib/admin/types";

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
  deleteTitle: "حذف دیدگاه",
  repliesLabel: "پاسخ‌ها",
  prevPage: "صفحه قبل",
  nextPage: "صفحه بعد",
  pageInfoSuffix: "صفحه",
  resultsSuffix: "دیدگاه",
} as const;

export const COMMENT_STATUS_META: Record<CommentStatus, { label: string }> = {
  PENDING: {
    label: "در انتظار بررسی",
  },
  APPROVED: {
    label: "تأییدشده",
  },
  REJECTED: {
    label: "ردشده",
  },
};
