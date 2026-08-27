export interface PostComment {
  id: string;
  author: string;
  /** Displayed next to the author name, e.g. «عضو تک‌یار» / «تیم تک‌یار». */
  role: string;
  /** Editorial replies get an accented identity chip and avatar tint. */
  isTeamAuthor?: boolean;
  date: string;
  message: string;
  /** One level of nesting, mirroring typical blog-comment threads. */
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
    role: "عضو تک‌یار",
    date: "۱۴ مرداد ۱۴۰۵",
    message:
      "خیلی کاربردی بود! مخصوصاً بخش اشتباه‌های رایج؛ دقیقاً همان چیزی بود که مربیم همیشه تذکرش را می‌دهد. منتظر مقاله بعدی هستم.",
    replies: [
      {
        id: "c1-r1",
        author: "تیم تحریریه تک‌یار",
        role: "تیم تک‌یار",
        isTeamAuthor: true,
        date: "۱۵ مرداد ۱۴۰۵",
        message:
          "ممنون از انرژی‌ات سارا جان! مقاله بعدی درباره تکنیک‌های ضربه پشتی در راه است؛ منتظر باش.",
      },
    ],
  },
  {
    id: "c2",
    author: "امیرحسین کریمی",
    role: "عضو تک‌یار",
    date: "۱۹ مرداد ۱۴۰۵",
    message:
      "من کمربند سبزم و این هفته آزمون دارم. برنامه پیشنهادی‌تان را یک هفته است اجرا می‌کنم و واقعاً تعادلم بهتر شده. ممنون از تیم تک‌یار 🙏",
  },
  {
    id: "c3",
    author: "نگار رستمی",
    role: "عضو تک‌یار",
    date: "۲۴ مرداد ۱۴۰۵",
    message:
      "پیشنهاد می‌کنم درباره گرم‌کردن قبل از تمرین هم جداگانه بنویسید؛ فکر کنم خیلی‌ها مثل من سراغش را کم می‌گیرند.",
    replies: [
      {
        id: "c3-r1",
        author: "تیم تحریریه تک‌یار",
        role: "تیم تک‌یار",
        isTeamAuthor: true,
        date: "۲۵ مرداد ۱۴۰۵",
        message: "پیشنهاد عالی‌ای است؛ آن را به تقویم محتوایی اضافه کردیم. مرسی نگار!",
      },
      {
        id: "c3-r2",
        author: "محمد اکبری",
        role: "عضو تک‌یار",
        date: "۲۶ مرداد ۱۴۰۵",
        message:
          "من هم موافقم؛ سال پیش کولم دچار آسیب شد چون گرم‌کردن را جدی نمی‌گرفتم.",
      },
    ],
  },
];

/**
 * Frontend placeholder for per-post comments until a backend exists.
 * Swap the body with an API/DB call later without touching the UI.
 */
export function getPostComments(): PostComment[] {
  return MOCK_COMMENTS;
}
