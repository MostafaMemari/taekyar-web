import Link from "next/link";
import { CalendarDays, ChevronLeft, Clock, PenLine } from "lucide-react";

import { getCategoryStyle } from "@/data/blog/index-page";
import { POST_LABELS } from "@/data/blog/post-config";
import type { BlogPost } from "@/lib/blog";
import { categoryHref } from "@/lib/routes";
import { formatFaDate, toFaDigits } from "@/lib/utils";

interface PostHeaderProps {
  post: BlogPost;
  trail: Array<{ name: string; path: string }>;
}

export function PostHeader({ post, trail }: PostHeaderProps) {
  const crumbs = [
    { name: "خانه", path: "/" },
    { name: "بلاگ", path: "/blog" },
    ...trail,
  ];

  return (
    <header className="mx-auto max-w-3xl text-center">
      <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center justify-center gap-1 text-[12px] font-medium text-black/45">
        {crumbs.map((crumb, index) => (
          <span key={crumb.path} className="inline-flex items-center gap-1">
            {index > 0 ? <ChevronLeft aria-hidden="true" className="size-3 text-black/25" /> : null}
            <Link href={crumb.path} className="transition-colors hover:text-[#a37800]">
              {crumb.name}
            </Link>
          </span>
        ))}
        <span aria-hidden="true" className="inline-flex items-center gap-1 text-black/70">
          <ChevronLeft className="size-3 text-black/25" />
          <span className="line-clamp-1 max-w-56">{post.title}</span>
        </span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {post.categories.map((category) => {
          const { color, Icon } = getCategoryStyle(category.name);
          return (
            <Link
              key={category.id}
              href={categoryHref(category.path)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-80"
              style={{ backgroundColor: `${color}14`, color }}
            >
              <Icon className="size-3.5" />
              {category.name}
            </Link>
          );
        })}
        {post.readTimeMinutes ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-bold text-black/55">
            <Clock className="size-3.5" />
            {toFaDigits(post.readTimeMinutes)} {POST_LABELS.readTimeSuffix}
          </span>
        ) : null}
      </div>

      <h1 className="mt-5 text-balance font-heading text-[1.7rem] leading-[1.5] text-[#1b2330] sm:text-[2.1rem] sm:leading-[1.45] lg:text-[2.5rem] lg:leading-[1.4]">
        {post.title}
      </h1>

      <div aria-hidden="true" className="mx-auto mt-5 flex w-56 items-center gap-2">
        <span className="h-px flex-1 bg-gradient-to-l from-[#E0A800] to-transparent" />
        <span className="size-1.5 rotate-45 bg-[#E0A800]" />
        <span className="h-px flex-1 bg-gradient-to-r from-[#E0A800] to-transparent" />
      </div>

      <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-black/[0.06] bg-white px-5 py-2.5 shadow-[0_10px_26px_-16px_rgba(15,23,42,0.3)]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#EFC94C] to-[#D99E00] text-white shadow-[0_6px_12px_-6px_rgba(154,109,0,0.6)]">
          <PenLine className="size-4" />
        </span>
        <span className="text-[13px]">
          <span className="font-extrabold text-[#a37800]">{POST_LABELS.author}</span>
          {post.date ? (
            <span className="inline-flex items-center gap-1 text-black/50">
              <span aria-hidden="true" className="mx-2 inline-block size-1 rounded-full bg-black/20" />
              <CalendarDays className="size-3.5" />
              {formatFaDate(post.date)}
            </span>
          ) : null}
        </span>
      </div>
    </header>
  );
}
