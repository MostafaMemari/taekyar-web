import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toFaDigits(n: number) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
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
