export interface PostComment {
  id: string;
  author: string;
  date: string;
  message: string;
}

export const COMMENTS_LABELS = {
  eyebrow: "گفت‌وگو با جامعه تک‌یار",
  title: "دیدگاه‌ها",
  countSuffix: "دیدگاه",
  formTitle: "دیدگاه‌ات را بنویس",
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
  successTitle: "دیدگاهت ثبت شد!",
  successDescription:
    "ممنون که با ما هم‌فکری می‌کنی؛ پس از بررسی، دیدگاهت در همین بخش منتشر می‌شود.",
  resetAction: "نوشتن دیدگاه دیگر",
} as const;

export const COMMENT_FORM_ERRORS = {
  name: "نام‌ات را بنویس تا در گفت‌وگو شناخته شوی.",
  emailRequired: "برای اطلاع از انتشار دیدگاه، ایمیل‌ات را وارد کن.",
  emailInvalid: "این یک نشانی ایمیل معتبر نیست؛ بررسی کن.",
  messageShort: "دیدگاه خیلی کوتاه است؛ کمی بیشتر بنویس (حداقل ۱۰ حرف).",
} as const;

/** Rotation of avatar tints, echoing the taekwondo belt palette. */
export const COMMENT_AVATAR_TINTS = [
  "bg-primary/15 text-primary",
  "bg-belt-green/15 text-belt-green",
  "bg-belt-blue/15 text-belt-blue",
  "bg-belt-yellow/20 text-[#8a6d00]",
] as const;

export const MOCK_COMMENTS: PostComment[] = [
  {
    id: "c1",
    author: "سارا محمدی",
    date: "۱۴ مرداد ۱۴۰۵",
    message:
      "خیلی کاربردی بود! مخصوصاً بخش اشتباه‌های رایج؛ دقیقاً همان چیزی بود که مربیم همیشه تذکرش را می‌دهد. منتظر مقاله بعدی هستم.",
  },
  {
    id: "c2",
    author: "امیرحسین کریمی",
    date: "۱۹ مرداد ۱۴۰۵",
    message:
      "من کمربند سبزم و این هفته آزمون دارم. برنامه پیشنهادی‌تان را یک هفته است اجرا می‌کنم و واقعاً تعادلم بهتر شده. ممنون از تیم تک‌یار 🙏",
  },
  {
    id: "c3",
    author: "نگار رستمی",
    date: "۲۴ مرداد ۱۴۰۵",
    message:
      "پیشنهاد می‌کنم درباره گرم‌کردن قبل از تمرین هم جداگانه بنویسید؛ فکر کنم خیلی‌ها مثل من سراغش را کم می‌گیرند.",
  },
];

/**
 * Frontend placeholder for per-post comments until a backend exists.
 * Swap the body with an API/DB call later without touching the UI.
 */
export function getPostComments(): PostComment[] {
  return MOCK_COMMENTS;
}
