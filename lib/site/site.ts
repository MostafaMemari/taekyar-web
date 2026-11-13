export const SITE_NAME = "تک‌یار";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taekyar.ir";

export const FALLBACK_SITE_SETTINGS = {
  siteName: SITE_NAME,
  siteTitle: "تک‌یار | همراه تمرینی تکواندو",
  siteDescription:
    "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند، از کمربند سفید تا مشکی",
} as const;
