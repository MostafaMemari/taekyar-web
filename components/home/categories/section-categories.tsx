import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Download,
  MessageCircleQuestion,
  Phone,
  Trophy,
  UtensilsCrossed,
  Video,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/shared/section";
import { SECTIONS_DIR } from "@/data/home/landing";
import type { PublicCategoryNode } from "@/lib/blog";
import { toFaDigits } from "@/lib/utils";

interface SectionCard {
  key: string;
  href: string;
  Icon: LucideIcon;
  accent: string;
  pillTint: string;
  title: string;
  pill: string;
  description: string;
  wide?: boolean;
}

function categoryMeta(name: string): { Icon: LucideIcon; accent: string; pillTint: string } {
  if (name.includes("تغذیه")) {
    return { Icon: UtensilsCrossed, accent: "#2e8b57", pillTint: "bg-[#DFF2E8] text-[#227046]" };
  }
  if (name.includes("تکنیک")) {
    return { Icon: Video, accent: "#1f5fa8", pillTint: "bg-[#DCE8FA] text-[#1f5fa8]" };
  }
  return { Icon: Trophy, accent: "#e11d48", pillTint: "bg-[#FDE4EC] text-[#be123c]" };
}

function buildCards(categories: PublicCategoryNode[]): SectionCard[] {
  const total = categories.reduce((sum, category) => sum + category.postCount, 0);

  const cards: SectionCard[] = [
    {
      key: "blog",
      href: "/blog",
      Icon: BookOpen,
      accent: "#E0A800",
      pillTint: "bg-[#FDF3D7] text-[#8a6a00]",
      title: "مقالات آموزشی",
      pill: `${toFaDigits(total)} مقاله`,
      description:
        "هر مقاله یک صفحه از مسیر است: از فرم ضربات تا تغذیه و آمادگی مسابقه؛ همیشه در دسترس.",
      wide: true,
    },
  ];

  categories.slice(0, 3).forEach((category) => {
    const meta = categoryMeta(category.name);
    cards.push({
      key: String(category.id),
      href: `/blog/category/${category.path}`,
      Icon: meta.Icon,
      accent: meta.accent,
      pillTint: meta.pillTint,
      title: category.name,
      pill: `${toFaDigits(category.postCount)} مقاله`,
      description: "مقاله‌های همین بخش را از اول تا آخر بخوان و تمرینت را کامل کن.",
    });
  });

  cards.push(
    {
      key: "faq",
      href: "#faq",
      Icon: MessageCircleQuestion,
      accent: "#8B5CF6",
      pillTint: "bg-[#EDE7FD] text-[#6d28d9]",
      title: "سوالات متداول",
      pill: "پرتکرارها",
      description: "هر چیزی که شروع‌کننده‌ها می‌پرسند؛ یک‌جا و کوتاه.",
    },
    {
      key: "download",
      href: "#download",
      Icon: Download,
      accent: "#E0A800",
      pillTint: "bg-[#FDF3D7] text-[#8a6a00]",
      title: "دانلود اپلیکیشن",
      pill: "رایگان",
      description:
        "تک‌یار را نصب کن؛ برنامه هفتگی‌ات ساخته می‌شود و مسیر کمربندت همیشه جلوی چشمت است.",
      wide: true,
    },
    {
      key: "contact",
      href: "/contact",
      Icon: Phone,
      accent: "#0d9488",
      pillTint: "bg-[#D5F1EF] text-[#0d9488]",
      title: "تماس با ما",
      pill: "پیام بگذار",
      description: "سوال، پیشنهاد یا همکاری؟ پیامت را برایمان بگذار.",
    },
  );

  return cards;
}

export function SectionCategories({ categories }: { categories: PublicCategoryNode[] }) {
  if (categories.length === 0) return null;
  const cards = buildCards(categories);

  return (
    <Section tone="default">
      
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-heading leading-snug text-[#1b2330] sm:text-4xl sm:leading-snug">
            {SECTIONS_DIR.title}
          </h2>
          <p className="mt-4 text-pretty text-[15px] leading-8 text-black/55">
            {SECTIONS_DIR.description}
          </p>
        </div>
      

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.key} className={card.wide ? "sm:col-span-2" : undefined}>
            
              <Link
                href={card.href}
                className="group flex h-full flex-col gap-4 rounded-3xl border border-black/[0.07] bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: card.accent,
                        backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${card.accent} 80%, white) 0%, ${card.accent} 55%, color-mix(in srgb, ${card.accent} 84%, black) 100%)`,
                        boxShadow: `inset 0 2px 5px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.15), 0 12px 20px -10px ${card.accent}`,
                      }}
                    >
                      <card.Icon className="!size-6 text-white" />
                    </span>
                    <h3 className="truncate text-base font-extrabold text-[#1b2330] sm:text-lg">
                      {card.title}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${card.pillTint}`}
                  >
                    {card.pill}
                  </span>
                </div>

                <p className="text-[13px] leading-7 text-black/55">{card.description}</p>

                <span className="mt-auto flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4 text-sm font-extrabold text-[#c79500]">
                  ورود به بخش
                  <span
                    className="flex size-7 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:-translate-x-0.5"
                    style={{ backgroundColor: card.accent }}
                  >
                    <ArrowLeft className="size-3.5" />
                  </span>
                </span>
              </Link>
            
          </li>
        ))}
      </ul>
    </Section>
  );
}
