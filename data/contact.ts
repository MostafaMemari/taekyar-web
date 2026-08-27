import { BookOpen, Clock, Mail, Phone, Send } from "lucide-react";
import { InstagramIcon } from "@/components/shared/icons";

export const CONTACT_PAGE_INTRO = {
  eyebrow: "تماس با ما",
  title: "حرفی برای گفتن یا سوالی درباره تک‌یار داری؟",
  description:
    "تیم تک‌یار پیام‌ها را خودش می‌خواند و جواب می‌دهد؛ از گزارش یک اشکال تا پیشنهاد فن جدید یا همکاری. فرم روبه‌رو سریع‌ترین راه رسیدن پیامت به دست ماست.",
};

export const SUPPORT_EMAIL = "info@taekyar.ir";
export const SUPPORT_PHONE_NUMBER = "+982191008524";

export interface ContactChannel {
  id: string;
  title: string;
  value: string;
  hint: string;
  href: string;
  isExternal: boolean;
  chipClassName: string;
  Icon: typeof Mail | typeof InstagramIcon;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    title: "ایمیل",
    value: SUPPORT_EMAIL,
    hint: "مناسب برای پیام‌های رسمی و همکاری",
    href: `mailto:${SUPPORT_EMAIL}`,
    isExternal: false,
    chipClassName: "bg-primary/15 text-primary ring-primary/25",
    Icon: Mail,
  },
  {
    id: "phone",
    title: "تلفن پشتیبانی",
    value: "021 - 9100 8524",
    hint: "شنبه تا پنج‌شنبه، ۹ تا ۱۸",
    href: `tel:${SUPPORT_PHONE_NUMBER}`,
    isExternal: false,
    chipClassName: "bg-belt-green/15 text-belt-green ring-belt-green/25",
    Icon: Phone,
  },
  {
    id: "telegram",
    title: "تلگرام",
    value: "TaekyarApp@",
    hint: "پاسخ سریع در ساعات کاری",
    href: "https://t.me/TaekyarApp",
    isExternal: true,
    chipClassName: "bg-belt-blue/15 text-belt-blue ring-belt-blue/25",
    Icon: Send,
  },
  {
    id: "instagram",
    title: "اینستاگرام",
    value: "taekyar.app@",
    hint: "اخبار و نکته‌های تمرینی هفتگی",
    href: "https://instagram.com/taekyar.app",
    isExternal: true,
    chipClassName: "bg-belt-yellow/20 text-yellow-700 ring-belt-yellow/40",
    Icon: InstagramIcon,
  },
];

export interface PreContactTip {
  title: string;
  description: string;
  Icon: typeof Clock;
}

export const PRE_CONTACT_TIPS: PreContactTip[] = [
  {
    title: "زمان پاسخگویی",
    description: "معمولاً در کمتر از ۲۴ ساعت کاری به پیامت جواب می‌دهیم.",
    Icon: Clock,
  },
  {
    title: "ساعات کاری",
    description: "شنبه تا پنج‌شنبه، از ساعت ۹ صبح تا ۶ عصر همراهیم.",
    Icon: BookOpen,
  },
];

export const QUICK_FAQ_LABEL = "پاسخ بسیاری از سؤال‌ها را می‌توانی همین حالا در سؤالات متداول پیدا کنی.";

export const FOLLOW_TITLE = "تک‌یار را دنبال کنید";

export const SUBJECT_OPTIONS = [
  "گزارش اشکال در اپلیکیشن",
  "پیشنهاد فن یا ویژگی جدید",
  "همکاری و تبلیغات",
  "سوال درباره تمرین و کمربندها",
  "موضوع دیگر",
] as const;

export interface ContactMessageDraft {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const FORM_LABELS = {
  legend: "فرم تماس",
  name: "نام و نام خانوادگی",
  namePlaceholder: "مثلاً سارا محمدی",
  email: "آدرس ایمیل",
  emailPlaceholder: "you@example.com",
  subject: "موضوع پیام",
  message: "پیام شما",
  messagePlaceholder: "هرچه دوست داری برایمان بنویسی…",
  submit: "ارسال پیام",
  formHint: "با ارسال فرم، پیامت به‌صورت ایمیل برای ما باز می‌شود.",
  successTitle: "پیامت آماده ارسال است!",
  successDescription:
    "اپلیکیشن ایمیل باز شد؛ فقط کافی است دکمه ارسال را بزنی. اگر باز نشد، مستقیم به آدرس بالای صفحه ایمیل بزن.",
  resetAction: "نوشتن پیام دیگر",
} as const;

export const FORM_ERRORS = {
  name: "نام‌ات را بنویس تا بدانیم با چه کسی حرف می‌زنیم.",
  emailRequired: "برای دریافت پاسخ، ایمیل‌ات را وارد کن.",
  emailInvalid: "این یک نشانی ایمیل معتبر نیست؛ بررسی کن.",
  messageShort: "پیام خیلی کوتاه است؛ کمی بیشتر توضیح بده (حداقل ۱۰ حرف).",
} as const;