import { FileText, FolderTree, LayoutDashboard, MessagesSquare, Tag as TagIcon } from "lucide-react";

import type { CommentStatus } from "@/lib/admin-types";
import type { PostBlock } from "@/lib/post-content";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "نمای کلی", Icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "مقالات", Icon: FileText },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", Icon: FolderTree },
  { href: "/dashboard/tags", label: "برچسب‌ها", Icon: TagIcon },
  { href: "/dashboard/comments", label: "دیدگاه‌ها", Icon: MessagesSquare },
];

export const LOGIN_LABELS = {
  title: "ورود به پیشخوان",
  description: "برای مدیریت وبلاگ و دیدگاه‌ها وارد حساب مدیریت شوید.",
  username: "نام کاربری",
  usernamePlaceholder: "نام کاربری مدیر",
  password: "گذرواژه",
  passwordPlaceholder: "••••••••",
  submit: "ورود",
  invalid: "نام کاربری یا گذرواژه اشتباه است.",
} as const;

export const DASHBOARD_LABELS = {
  panel: "پیشخوان مدیریت",
  logout: "خروج از حساب",
  viewSite: "مشاهده سایت",
  sectionLabel: "ناوبری پیشخوان",
} as const;

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

export const POSTS_TABLE_LABELS = {
  title: "مقالات",
  description: "ایجاد، ویرایش و حذف مقالات وبلاگ.",
  newPost: "مقاله جدید",
  searchPlaceholder: "جستجو در عنوان یا نشانی…",
  searchLabel: "جستجوی مقاله",
  columnTitle: "عنوان",
  columnCategory: "دسته‌بندی",
  columnDate: "تاریخ",
  columnReadTime: "زمان مطالعه",
  columnComments: "دیدگاه‌ها",
  columnActions: "عملیات",
  edit: "ویرایش",
  delete: "حذف",
  deleteConfirm: "این مقاله و همه دیدگاه‌هایش حذف شود؟",
  empty: "مقاله‌ای یافت نشد.",
  prevPage: "صفحه قبل",
  nextPage: "صفحه بعد",
  pageInfoSuffix: "صفحه",
  resultsSuffix: "مقاله",
  deleted: "مقاله حذف شد.",
  deleteError: "حذف انجام نشد؛ دوباره تلاش کنید.",
} as const;

export const POST_FORM_LABELS = {
  newTitle: "مقاله جدید",
  newDescription: "مقاله‌ای برای وبلاگ تک‌یار بنویسید.",
  editTitle: "ویرایش مقاله",
  editDescription: "محتوای مقاله را به‌روزرسانی کنید.",
  titleLabel: "عنوان",
  titlePlaceholder: "عنوان مقاله",
  slugLabel: "نشانی (اسلاگ)",
  slugPlaceholder: "article-slug",
  excerptLabel: "خلاصه",
  excerptPlaceholder: "چکیده‌ای کوتاه برای نمایش در فهرست مقالات",
  categoryLabel: "دسته‌بندی",
  tagsLabel: "برچسب‌ها",
  tagsHint: "چند برچسب را می‌توانید انتخاب کنید.",
  tagsEmpty: "برچسبی ساخته نشده؛ از بخش برچسب‌ها اضافه کنید.",
  dateLabel: "تاریخ نمایش",
  datePlaceholder: "۲۵ مرداد ۱۴۰۵",
  readTimeLabel: "زمان مطالعه (دقیقه)",
  contentLabel: "محتوا",
  contentHint: "بخش‌های مقاله را به ترتیب بسازید.",
  addBlock: "افزودن بخش",
  blockUp: "انتقال به بالا",
  blockDown: "انتقال به پایین",
  removeBlock: "حذف بخش",
  textPlaceholder: "متن…",
  listPlaceholder: "هر گزینه در یک خط",
  cancel: "انصراف",
  submitCreate: "انتشار مقاله",
  submitUpdate: "ذخیره تغییرات",
  saving: "در حال ذخیره…",
  error: "ذخیره انجام نشد؛ دوباره تلاش کنید.",
  slugTaken: "این نشانی قبلاً استفاده شده است؛ نشانی دیگری انتخاب کنید.",
} as const;

export const BLOCK_TYPE_LABELS: Record<PostBlock["type"], string> = {
  paragraph: "پاراگراف",
  heading: "سرفصل",
  list: "فهرست",
  tip: "نکته مربی",
  quote: "نقل قول",
};

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
  error: "انجام نشد؛ دوباره تلاش کنید.",
  confirmDelete: "این دیدگاه حذف شود؟",
  repliesLabel: "پاسخ‌ها",
} as const;

export const COMMENT_STATUS_META: Record<
  CommentStatus,
  { label: string; badgeClassName: string }
> = {
  PENDING: {
    label: "در انتظار بررسی",
    badgeClassName: "bg-belt-yellow/20 text-[#8a6d00] ring-belt-yellow/40",
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

export const TAXONOMY_LABELS = {
  kinds: {
    category: {
      title: "دسته‌بندی‌ها",
      description: "مدیریت دسته‌بندی‌های مقالات وبلاگ.",
      new: "دسته‌بندی جدید",
      newTitle: "دسته‌بندی جدید",
      newDescription: "یک دسته‌بندی برای مقالات بسازید.",
      editTitle: "ویرایش دسته‌بندی",
      editDescription: "اطلاعات دسته‌بندی را به‌روزرسانی کنید.",
      searchPlaceholder: "جستجو در دسته‌بندی‌ها…",
      empty: "دسته‌بندی‌ای یافت نشد.",
      deleted: "دسته‌بندی حذف شد.",
      confirmDelete: "این دسته‌بندی حذف شود؟ مقالات حذف نمی‌شوند.",
      postsSuffix: "مقاله",
    },
    tag: {
      title: "برچسب‌ها",
      description: "مدیریت برچسب‌های مقالات وبلاگ.",
      new: "برچسب جدید",
      newTitle: "برچسب جدید",
      newDescription: "یک برچسب برای مقالات بسازید.",
      editTitle: "ویرایش برچسب",
      editDescription: "اطلاعات برچسب را به‌روزرسانی کنید.",
      searchPlaceholder: "جستجو در برچسب‌ها…",
      empty: "برچسبی یافت نشد.",
      deleted: "برچسب حذف شد.",
      confirmDelete: "این برچسب حذف شود؟ مقالات حذف نمی‌شوند.",
      postsSuffix: "مقاله",
    },
  },
  nameLabel: "نام",
  namePlaceholder: "نام",
  slugLabel: "نشانی (اسلاگ)",
  slugPlaceholder: "category-slug",
  imageLabel: "تصویر",
  imageHint: "JPG، PNG یا WebP — حداکثر ۵ مگابایت",
  imageAlt: "پیش‌نمایش تصویر",
  upload: "انتخاب تصویر",
  uploading: "در حال آپلود…",
  removeImage: "حذف تصویر",
  seoTitle: "سئو",
  seoHint: "اگر خالی بماند، از نام و اطلاعات خود صفحه استفاده می‌شود.",
  metaTitleLabel: "عنوان سئو",
  metaTitlePlaceholder: "عنوان صفحه در نتایج جستجو",
  metaDescriptionLabel: "توضیحات سئو",
  metaDescriptionPlaceholder: "توضیح کوتاه صفحه در نتایج جستجو",
  submitCreate: "ایجاد",
  submitUpdate: "ذخیره تغییرات",
  saving: "در حال ذخیره…",
  error: "ذخیره انجام نشد؛ دوباره تلاش کنید.",
  slugTaken: "این نام یا نشانی قبلاً استفاده شده است.",
  deleteError: "حذف انجام نشد؛ دوباره تلاش کنید.",
  uploadError: "آپلود انجام نشد؛ دوباره تلاش کنید.",
  unsupportedType: "فرمت تصویر پشتیبانی نمی‌شود (JPG، PNG یا WebP).",
  fileTooLarge: "حجم تصویر بیشتر از ۵ مگابایت است.",
} as const;

