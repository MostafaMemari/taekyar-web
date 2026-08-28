export const ABOUT_INTRO = {
  eyebrow: "درباره تک‌یار",
  title: "همراه تمرینی تو، از اولین کمربند تا مشکی",
  description:
    "تک‌یار برای این ساخته شده که تمرین تکواندو هدفمند، قابل اندازه‌گیری و دلچسب باشد؛ هر فن را دقیق یاد بگیری، پیشرفتت را ببینی و با انگیزه روی تشک برگردی.",
};

export const ABOUT_STATS = [
  { value: "+۱۲ هزار", label: "ورزشکار همراه" },
  { value: "+۲۵۰", label: "فن آموزشی" },
  { value: "+۸۰", label: "باشگاه همکار" },
  { value: "۳۱", label: "استان تحت پوشش" },
];

export const ABOUT_STORY = {
  eyebrow: "قصه ما",
  title: "از تشک تمرین تا گوشی همراه",
  paragraphs: [
    "تک‌یار از یک دغدغه ساده شروع شد: ورزشکاران تکواندو معمولاً نمی‌دانند در مسیر پیشرفتشان کجا ایستاده‌اند. نام‌گذاری کمربندها گلچین می‌شود، آزمون‌ها بر اساس حس و حافظه مربی ارزیابی می‌شود و بخش بزرگی از آنچه آموخته شده به مراتب فراموش می‌شود.",
    "ما تیم کوچکی از هنرجویان و برنامه‌نویسان هستیم که این شکاف را با اپلیکیشن تک‌یار پر کرده‌ایم؛ جایی که برنامه تمرین شخصی‌سازی می‌شود، فن‌ها گام‌به‌گام آموزش داده می‌شوند و هر قدم کوچک ثبت و دیده می‌شود.",
  ],
};

export const ABOUT_MOTTO_CARD = {
  quotes: [
    {
      quote: "در تکواندو، هر کمربند با هزار تمرین ساده شروع می‌شود؛ ما همان هزار تمرین را برایت منظم می‌کنیم.",
      author: "تیم تک‌یار",
    },
    {
      quote: "پیشرفت واقعی وقتی اتفاق می‌افتد که بتوانی یک هفته بعد از تمرین هم آن را با اعداد ببینی.",
      author: "دپارتمان آموزش",
    },
    {
      quote: "هدف ما این نیست که ساعت بیشتری روی تشک باشی؛ هدف ما این است که هر ساعتش بهتر صرف شود.",
      author: "دپارتمان محصول",
    },
  ],
  navLabels: { prev: "نقل قول قبلی", next: "نقل قول بعدی" },
};


export type AboutIconName = "target" | "trending-up" | "messages-square" | "sparkles";

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  iconName: AboutIconName;
  chipClassName: string;
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    id: "precision",
    title: "آموزش دقیق",
    description: "هر فن با جزئیات فنی، اشتباه‌های رایج و نکات داوری؛ همان چیزی که در آزمون نیاز داری.",
    iconName: "target",
    chipClassName: "bg-primary/15 text-primary ring-primary/25",
  },
  {
    id: "motivation",
    title: "انگیزه پایدار",
    description: "پیشرفت را دیدنی می‌کنیم؛ رشد کمربندی، رکورد تمرین و گزارش هفتگی که تو را پای تشک نگه می‌دارد.",
    iconName: "trending-up",
    chipClassName: "bg-belt-green/15 text-belt-green ring-belt-green/25",
  },
  {
    id: "community",
    title: "جامعه ورزشی",
    description: "وبلاگ، بحث‌ها و تجربه‌های ورزشکاران؛ جایی که یاد گرفتن تنها اتفاق نمی‌افتد.",
    iconName: "messages-square",
    chipClassName: "bg-belt-blue/15 text-belt-blue ring-belt-blue/25",
  },
  {
    id: "simplicity",
    title: "سادگی و تمرکز",
    description: "بدون شلوغی و تبلیغ اضافه؛ فقط ابزارهایی که واقعاً در تمرین روزانه به کارت می‌آیند.",
    iconName: "sparkles",
    chipClassName: "bg-belt-yellow/20 text-yellow-700 ring-belt-yellow/40",
  },
];

export const ABOUT_CTA = {
  title: "پیشنهادی برای بهتر شدن تک‌یار داری؟",
  description: "مسیر ما با نظر ورزشکاران و مربیان ساخته می‌شود؛ خوشحال می‌شویم صدایت را بشنویم.",
  actionLabel: "تماس با تیم تک‌یار",
  actionHref: "/contact",
};
