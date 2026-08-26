export const POST_LAYOUT = {
  postColumns: "lg:grid-cols-[18rem_minmax(0,1fr)]",
} as const;

export const RELATED_POSTS_COUNT = 3;

/** Curated evergreen training guides, surfaced in the article sidebar. */
export const TRAINING_GUIDE_SLUGS = [
  "poomsae-taeguk-one-guide",
  "home-flexibility-routine",
  "dollyo-chagki-common-mistakes",
] as const;

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
  authorRole: "مقالات زیر نظر مربیان",
  tocTitle: "سرفصل‌ها",
  tocMobileTitle: "سرفصل‌های این مقاله",
  coachTipLabel: "نکته مربی",
  tagsLabel: "برچسب‌ها:",
  relatedTitle: "مطالب مرتبط",
  relatedEyebrow: "ادامه مسیر تمرین",
  readTimeSuffix: "دقیقه مطالعه",
  progressLabel: "پیشرفت مطالعه",
  guidesTitle: "راهنماهای تمرینی",
  categoriesTitle: "دسته‌بندی‌ها",
  postsCountSuffix: "مقاله",
  appCtaTitle: "تمرین منظم، پیشرفت سریع‌تر",
  appCtaDescription:
    "با اپ تک‌یار برنامه تمرین شخصی داشته باش، مسیر کمربندت را پیگیری کن و فن‌ها را گام‌به‌گام یاد بگیر.",
  appCtaActionLabel: "آشنایی با تک‌یار",
} as const;
