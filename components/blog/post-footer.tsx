import Link from "next/link";
import { ArrowLeft, MessageCircle, PenLine, Send } from "lucide-react";

import { POST_LABELS } from "@/data/blog/post-config";
import { SITE_URL } from "@/lib/site";
import { postHref } from "@/lib/routes";

export function PostFooter({ slug, title }: { slug: string; title: string }) {
  const url = `${SITE_URL}${postHref(slug)}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shares = [
    {
      label: "تلگرام",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: Send,
    },
    {
      label: "واتساپ",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
    {
      label: "ایکس",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: undefined,
    },
  ];

  return (
    <div className="mt-10 sm:mt-12">
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/[0.06] pt-6">
        <span className="text-[13px] font-bold text-black/50">اشتراک‌گذاری:</span>
        <div className="flex items-center gap-2">
          {shares.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`اشتراک‌گذاری در ${label}`}
              className="flex size-10 items-center justify-center rounded-full border border-black/[0.08] bg-white text-black/55 shadow-sm transition-colors duration-200 hover:border-[#E0A800]/50 hover:text-[#a37800]"
            >
              {Icon ? <Icon className="size-4" /> : <span className="text-sm font-black">𝕏</span>}
            </a>
          ))}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[26px] border border-[#E0A800]/25 bg-gradient-to-bl from-[#FDF6E1] via-[#FBF0D2] to-[#F7E9C3] p-6 sm:p-8">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-[#EFC94C] via-[#E0A800] to-[#9A6D00]"
        />
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-white shadow-[0_10px_20px_-8px_rgba(154,109,0,0.7)]">
            <PenLine className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-black/45">نوشتهٔ این مقاله</p>
            <p className="mt-1 font-heading text-xl text-[#a37800]">{POST_LABELS.author}</p>
            <p className="mt-2 max-w-lg text-[13px] leading-7 text-black/55">
              نکته‌های تمرینی تکواندو را تیم تحریریه تک‌یار با کمک مربی‌ها آماده می‌کند؛ ساده، درست و قابل استفاده در باشگاه و خانه.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E0A800]/40 bg-white/80 px-5 text-sm font-bold text-[#a37800] transition-colors duration-200 hover:border-[#E0A800] hover:bg-white"
          >
            مقالات بیشتر
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
