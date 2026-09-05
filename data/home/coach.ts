export const COACH_INTRO = {
  eyebrow: "مربی همراه",
  title: "هیچ سؤالی بی‌جواب نمی‌ماند",
  description: "فیلم تمرینت را بفرست، بازخورد بگیر و با برنامه مربی پیش برو.",
};

export const COACH_POINTS = [
  "بازخورد روی اجرای فن‌ها",
  "برنامه اختصاصی از مربی",
  "پیگیری آمادگی آزمون",
];

export const COACH_CHAT = {
  name: "مربی تک‌یار",
  status: "آنلاین",
  messages: [
    { from: "coach" as const, text: "تعادلت در دولیو چاگی خیلی بهتر شده." },
    { from: "user" as const, text: "برای آزمون کمربند آبی آماده‌ام!" },
  ],
  inputPlaceholder: "پیامت را بنویس…",
  cta: { label: "گفت‌وگو با مربی", href: "/contact" },
};
