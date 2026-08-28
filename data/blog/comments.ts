export interface PostComment {
  id: string;
  author: string;
  role: string;
  isTeamAuthor?: boolean;
  date: string;
  message: string;
  replies?: PostComment[];
}

export const COMMENTS_LABELS = {
  eyebrow: "گفت‌وگو با جامعه تک‌یار",
  title: "دیدگاه‌ها",
  countSuffix: "دیدگاه",
  formTitle: "دیدگاه‌ات را بنویس",
  addCommentButton: "ثبت نظر",
} as const;

export const COMMENT_REPLY_LABELS = {
  replyButton: "پاسخ",
  threadLabel: "پاسخ‌های این دیدگاه",
  replyToPrefix: "در پاسخ به",
  submit: "ارسال پاسخ",
  cancel: "انصراف",
  messageLabel: "متن پاسخ",
  messagePlaceholder: "پاسخ‌ات را بنویس…",
} as const;

export const COMMENT_FORM_LABELS = {
  name: "نام و نام خانوادگی",
  namePlaceholder: "مثلاً سارا محمدی",
  email: "آدرس ایمیل",
  emailPlaceholder: "you@example.com",
  message: "دیدگاه شما",
  messagePlaceholder: "نظرت درباره این مقاله چیه؟",
  submit: "ثبت دیدگاه",
  formHint: "پیش از انتشار، دیدگاهت توسط تیم تحریریه بررسی می‌شود.",
} as const;

export const COMMENT_TOAST_MESSAGES = {
  successTitle: "پیامت ثبت شد!",
  successDescription:
    "ممنون که با ما هم‌فکری می‌کنی؛ پس از بررسی، پیامت در همین بخش منتشر می‌شود.",
  errorTitle: "ثبت انجام نشد",
  errorDescription:
    "یک خطای غیرمنتظره رخ داد؛ چند لحظه بعد دوباره تلاش کن.",
} as const;

export const COMMENT_FORM_ERRORS = {
  name: "نام‌ات را بنویس تا در گفت‌وگو شناخته شوی.",
  emailRequired: "برای اطلاع از انتشار دیدگاه، ایمیل‌ات را وارد کن.",
  emailInvalid: "این یک نشانی ایمیل معتبر نیست؛ بررسی کن.",
  messageShort: "متن خیلی کوتاه است؛ کمی بیشتر بنویس (حداقل ۱۰ حرف).",
} as const;

export const COMMENT_AVATAR_TINTS = [
  "bg-primary/15 text-primary",
  "bg-belt-green/15 text-belt-green",
  "bg-belt-blue/15 text-belt-blue",
  "bg-belt-yellow/20 text-belt-yellow-fg",
] as const;
