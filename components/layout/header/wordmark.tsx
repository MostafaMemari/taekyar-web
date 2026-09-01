import Image from "next/image";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

interface WordmarkProps {
  onNavigate?: () => void;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
}

export function Wordmark({ onNavigate, siteName = SITE_NAME, logoImage, logoImageAlt }: WordmarkProps) {
  const logoUrl = logoImage ?? null;

  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={`${siteName} — صفحه اصلی`}
      className="group/mark flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={logoImageAlt || siteName}
          width={36}
          height={36}
          unoptimized
          className="size-9 shrink-0 rounded-lg object-cover shadow-sm shadow-primary/30 transition-transform duration-300 group-hover/mark:-rotate-3"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-lg bg-primary text-base font-black leading-none text-white shadow-sm shadow-primary/30 transition-transform duration-300 group-hover/mark:-rotate-3"
        >
          {siteName.trim().charAt(0) || "ت"}
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-black tracking-tight text-foreground">
          {siteName}
        </span>
        <span
          lang="ko"
          aria-hidden="true"
          className="mt-[3px] text-[9px] font-bold tracking-[0.22em] text-muted-foreground"
        >
          태권도
        </span>
      </span>
    </Link>
  );
}
