import type { R2Object } from "@/lib/r2";
import { toPersianDigits } from "@/lib/utils";

export const MEDIA_PREFIX = "uploads/";

export interface MediaItem {
  key: string;
  url: string;
  name: string;
  extension: string;
  typeLabel: string;
  size: number;
  sizeLabel: string;
  uploadedAt: string;
  uploadedAtLabel: string;
}

const EXTENSION_LABELS: Record<string, string> = {
  avif: "AVIF",
  gif: "GIF",
  jpeg: "JPEG",
  jpg: "JPEG",
  pdf: "PDF",
  png: "PNG",
  svg: "SVG",
  webp: "WebP",
};

const MEDIA_DATE_FORMAT = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const MEDIA_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9/_.-]{0,299}$/;
const MEDIA_FILE_PATTERN = /\.(jpe?g|png|webp)$/i;

export function isMediaKey(key: string): boolean {
  return (
    key.startsWith(MEDIA_PREFIX) &&
    !key.includes("..") &&
    !key.includes("//") &&
    MEDIA_KEY_PATTERN.test(key) &&
    MEDIA_FILE_PATTERN.test(key)
  );
}

export function mediaFileName(key: string): string {
  return key.slice(key.lastIndexOf("/") + 1);
}

export function mediaExtension(key: string): string {
  const name = mediaFileName(key);
  const separator = name.lastIndexOf(".");
  return separator > 0 ? name.slice(separator + 1).toLowerCase() : "";
}

export function formatMediaSize(bytes: number): string {
  if (bytes < 1024) return `${toPersianDigits(String(bytes))} بایت`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${toPersianDigits(kilobytes.toFixed(kilobytes < 10 ? 1 : 0))} کیلوبایت`;
  }

  const megabytes = kilobytes / 1024;
  return `${toPersianDigits(megabytes.toFixed(megabytes < 10 ? 2 : 1))} مگابایت`;
}

export function formatMediaDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return MEDIA_DATE_FORMAT.format(date);
}

export function toMediaItem(object: R2Object, url: string): MediaItem {
  const extension = mediaExtension(object.key);

  return {
    key: object.key,
    url,
    name: mediaFileName(object.key),
    extension,
    typeLabel: EXTENSION_LABELS[extension] ?? (extension ? extension.toUpperCase() : "فایل"),
    size: object.size,
    sizeLabel: formatMediaSize(object.size),
    uploadedAt: object.lastModified,
    uploadedAtLabel: formatMediaDate(object.lastModified),
  };
}
