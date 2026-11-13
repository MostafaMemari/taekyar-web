export const FOOTER_BLURB =
  "همراه تمرینی تکواندوکاران؛ از اولین ضربه تا کمربند مشکی، تمرین هدفمند و پیشرفت واقعی را برایت ساده‌تر می‌کنیم.";

export const FOOTER_COPYRIGHT = "© تمامی حقوق برای تک‌یار محفوظ است.";

export interface FooterSuggestedPhrase {
  label: string;
  href: string;
}

export const FOOTER_SUGGESTED_PHRASES: FooterSuggestedPhrase[] = [
  { label: "بلاگ تکواندو", href: "/blog" },
  { label: "دانشنامه فن‌ها", href: "/techniques" },
  { label: "ضربات پایه", href: "/techniques/chagi" },
  { label: "دفاع‌ها", href: "/techniques/maki" },
  { label: "پومسه و آزمون کمربند", href: "/techniques/poomsae" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "همکاری با ما", href: "/collab" },
  { label: "تماس با ما", href: "/contact" },
];
