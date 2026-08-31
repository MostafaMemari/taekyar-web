import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toFaDigits(n: number) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
}

export type PageItem = number | "dots";

export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const wanted = new Set(
    [1, 2, current - 1, current, current + 1, total - 1, total].filter((page) => page >= 1 && page <= total),
  );
  const sorted = [...wanted].sort((first, second) => first - second);

  const items: PageItem[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) items.push("dots");
    items.push(page);
    previous = page;
  }
  return items;
}

const faDateFormatter = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatFaDate(date: Date) {
  return faDateFormatter.format(date);
}

const ENGLISH_DIGITS = "0123456789";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(value: string): string {
  return value
    .replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[ENGLISH_DIGITS.indexOf(digit)])
    .replace(/[٠-٩]/g, (digit) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(digit)]);
}
