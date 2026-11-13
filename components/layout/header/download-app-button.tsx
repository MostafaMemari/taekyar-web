"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadAppButton({ href }: { href: string }) {
  return (
    <Button asChild className="hidden h-11 gap-2 rounded-xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-5 text-sm font-extrabold text-[#2A1F00] shadow-sm shadow-[#9A6D00]/30 transition-all duration-200 hover:-translate-y-px hover:from-[#EFAF0A] hover:via-[#D0A018] hover:to-[#A87800] hover:shadow-md hover:shadow-[#9A6D00]/40 md:inline-flex">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Download className="!size-4" />
        دانلود اپلیکیشن
      </a>
    </Button>
  );
}
