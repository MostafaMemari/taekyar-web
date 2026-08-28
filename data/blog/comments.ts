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
  submitting: "در حال ارسال…",
  cancel: "انصراف",
  messageLabel: "متن پاسخ",
  messagePlaceholder: "پاسخ‌ات را بنویس…",
} as const;

export const COMMENT_FORM_LABELS = {
  name: "نام و نام خانوادگی",
  namePlaceholder: "مثلاً سارا محمدی",
  message: "دیدگاه شما",
  messagePlaceholder: "نظرت درباره این مقاله چیه؟",
  submit: "ثبت دیدگاه",
  submitting: "در حال ارسال…",
  formHint: "پیش از انتشار، دیدگاهت توسط تیم تحریریه بررسی می‌شود.",
  captchaLabel: "تأیید امنیتی",
  captchaHint: "اعداد داخل تصویر را وارد کنید",
  captchaPlaceholder: "مثلاً ۷۳۹۴",
  captchaRefresh: "تصویر جدید",
  captchaUnavailable: "سؤال امنیتی موقتاً در دسترس نیست؛ چند لحظه بعد دکمهٔ تازه‌سازی را بزنید.",
} as const;

export const COMMENT_TOAST_MESSAGES = {
  successTitle: "پیامت ثبت شد!",
  successDescription:
    "ممنون که با ما هم‌فکری می‌کنی؛ پس از بررسی، پیامت در همین بخش منتشر می‌شود.",
  errorTitle: "ثبت انجام نشد",
  errorDescription:
    "یک خطای غیرمنتظره رخ داد؛ چند لحظه بعد دوباره تلاش کن.",
  rateLimitedTitle: "کمی صبر کن",
  rateLimitedDescription:
    "در مدت کوتاه چند دیدگاه ثبت کرده‌ای؛ چند دقیقه بعد دوباره تلاش کن.",
  captchaTitle: "تأیید امنیتی ناموفق بود",
  captchaDescription: "پاسخ سؤال امنیتی درست نیست یا منقضی شده؛ سؤال جدید را امتحان کن.",
} as const;

export const COMMENT_FORM_ERRORS = {
  name: "نام‌ات را بنویس تا در گفت‌وگو شناخته شوی.",
  messageShort: "متن خیلی کوتاه است؛ کمی بیشتر بنویس (حداقل ۱۰ حرف).",
  messageLong: "متن دیدگاه بیش از حد طولانی است.",
  captchaRequired: "پاسخ سؤال امنیتی را بنویس.",
} as const;

export const COMMENT_AVATAR_TINTS = [
  "bg-primary/15 text-primary",
  "bg-belt-green/15 text-belt-green",
  "bg-belt-blue/15 text-belt-blue",
  "bg-belt-yellow/20 text-belt-yellow-fg",
] as const;
