import Image from "next/image";
import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

interface LogoProps {
  onNavigate?: () => void;
  siteName?: string;
  logoImage?: string | null;
  logoImageAlt?: string | null;
}

export function Logo({ onNavigate, siteName = SITE_NAME, logoImage, logoImageAlt }: LogoProps) {
  const logoUrl = logoImage ?? null;
  const alt = logoImageAlt?.trim() ? logoImageAlt : siteName;

  const handleClick = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    onNavigate?.();
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label={`${siteName} — صفحه اصلی`}
      className="inline-flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={alt}
          width={180}
          height={45}
          unoptimized
          className="h-9 w-auto object-contain"
        />
      ) : (
        <span className="text-[17px] font-black tracking-tight text-foreground">
          {siteName}
        </span>
      )}
    </Link>
  );
}
