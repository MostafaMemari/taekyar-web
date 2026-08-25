export const POST_LAYOUT = {
  headerWidth: "max-w-3xl",
  bodyWidth: "max-w-5xl",
  tocColumns: "lg:grid-cols-[15rem_minmax(0,1fr)]",
} as const;

export const RELATED_POSTS_COUNT = 3;

export const POST_CONTACT_CTA = {
  title: "سوالی دارید؟ با ما در ارتباط باشید",
  description:
    "تیم پشتیبانی تک‌یار پاسخگوی سوالات شما درباره تمرین، آزمون کمربند و مسابقات است.",
  actionLabel: "تماس با ما",
  actionHref: "/contact",
} as const;

export const POST_LABELS = {
  backToBlog: "بازگشت به وبلاگ",
  author: "تیم تحریریه تک‌یار",
  tocTitle: "سرفصل‌ها",
  tagsLabel: "برچسب‌ها:",
  relatedTitle: "مطالب مرتبط",
  readTimeSuffix: "دقیقه مطالعه",
} as const;
