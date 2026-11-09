import {
  Footprints,
  Hand,
  ScrollText,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface TechniqueFamily {
  Icon: LucideIcon;
  name: string;
  korean: string;
  group: string;
  count: string;
  description: string;
  examples: string[];
}

export const TECHNIQUES_ENCYCLOPEDIA = {
  title: "دانشنامه فن‌های تک‌یار",
  description:
    "فن‌های رسمی تکواندو، دسته‌بندی‌شده و بازبینی‌شده توسط تیم تحریریه تک‌یار؛ برای هر فن اجرای گام‌به‌گام و نکته‌های آزمون کمربند آمده است.",
  stats: [
    { value: "۴", label: "خانواده فن" },
    { value: "۴۷", label: "فن و فرم استاندارد" },
    { value: "۶", label: "آزمون کمربند" },
  ],
  families: [
    {
      Icon: Footprints,
      name: "چاگی",
      korean: "차기",
      group: "ضربات پا",
      count: "۱۲ فن",
      description:
        "هویت اصلی تکواندو؛ از آپ چاگی ساده تا ناریو چاگی دوضربه، با تکیه بر تعادل و بازگشت کامل پا.",
      examples: ["آپ چاگی", "دولیو چاگی", "یوپ چاگی", "هوریو چاگی"],
    },
    {
      Icon: Shield,
      name: "ماکی",
      korean: "막기",
      group: "دفاع‌ها",
      count: "۱۰ فن",
      description:
        "دفاع با ساعد، لبه دست و تن؛ زاویه درست و سفت‌کردن مچ، تفاوت دفاع آموزشی و دفاع واقعی است.",
      examples: ["آرائه ماکی", "هانسونال ماکی", "گاوی ماکی", "یوپ ماکی"],
    },
    {
      Icon: Hand,
      name: "جیروگی",
      korean: "지르기",
      group: "ضربات دست",
      count: "۸ فن",
      description:
        "ضربه مشت و لبه دست از جای درست شروع می‌شود: کمر، نه شانه؛ پایه‌ی پومسه و دفاع شخصی.",
      examples: ["آپ جموکی", "دوبان جموکی", "سونال جموکی", "پیسون جموکی"],
    },
    {
      Icon: ScrollText,
      name: "پومسه",
      korean: "품새",
      group: "فرم‌ها",
      count: "۱۷ فرم",
      description:
        "هشت تگوک و نُه فرم ارشد؛ ردیف درست فن‌ها با نفس و ریتم، آیینه‌ی پیشرفت هر کمربند.",
      examples: ["تگوک ایل", "تگوک سام جانگ", "پیونگ‌وون", "کیپا"],
    },
  ] satisfies TechniqueFamily[],
  captionLead: "می‌خواهی همه را یک‌جا ببینی؟",
  captionLinkLabel: "در بخش تکنیک‌های بلاگ",
  captionRest: "آموزش هر فن با ویدیو و نکته‌های مربی‌ها منتشر می‌شود.",
};

export interface Technique {
  name: string;
  korean: string;
  group: string;
  hint: string;
}

export const TECHNIQUE_POOL: Technique[] = [
  {
    name: "آپ چاگی",
    korean: "앞차기",
    group: "چاگی",
    hint: "زانو اول بالا می‌آید، بعد ضربه با پنجه پا و برگشت دقیق به جای اول.",
  },
  {
    name: "دولیو چاگی",
    korean: "돌려차기",
    group: "چاگی",
    hint: "کف پای تکیه‌گاه می‌چرخد، ضربه با روی پا و گارد دست‌ها تا آخر.",
  },
  {
    name: "یوپ چاگی",
    korean: "옆차기",
    group: "چاگی",
    hint: "ضربه با لبه بیرونی پا به پهلو؛ بالاتنه مایل نشود.",
  },
  {
    name: "هوریو چاگی",
    korean: "후려차기",
    group: "چاگی",
    hint: "اول نگاه می‌چرخد، بعد بدن؛ ضربه با پاشنه در مسیر قوسی.",
  },
  {
    name: "باندال چاگی",
    korean: "반달차기",
    group: "چاگی",
    hint: "مسیر هلالی از بیرون به داخل؛ گزینه‌ی نزدیک‌بازی.",
  },
  {
    name: "ناریو چاگی",
    korean: "나이차기",
    group: "چاگی",
    hint: "دو ضربه پشت‌سرهم از پایین به بالا؛ ران کشیده، تعادل کامل.",
  },
  {
    name: "آرائه ماکی",
    korean: "아래막기",
    group: "ماکی",
    hint: "ساعد از بالا به پایین؛ شانه رها و مچ سفت.",
  },
  {
    name: "هانسونال ماکی",
    korean: "한손날막기",
    group: "ماکی",
    hint: "دفاع با لبه دست؛ دست دیگر همزمان به کمر جمع می‌شود.",
  },
  {
    name: "آپ جموکی",
    korean: "앞주먹지르기",
    group: "جیروگی",
    hint: "مشت از کنار کمر مستقیم به جلو؛ شانه بالا نمی‌آید.",
  },
  {
    name: "تگوک ایل",
    korean: "태극 1장",
    group: "پومسه",
    hint: "اولین فرم؛ ترکیب آرائه ماکی و آپ چاگی با نفس آرام.",
  },
];

export const TECHNIQUE_SHUFFLE = {
  title: "سری به دانشنامه فن‌ها بزن",
  description:
    "هر بار که این صفحه را باز کنی، چند فن تازه از دانشنامه اینجا می‌نشیند؛ اسم کره‌ای، نکته‌ی اجرا و خانواده‌اش کنار هم.",
  actionLabel: "دیدن همه فن‌ها",
};
