"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadAppButton({ href }: { href: string }) {
  return (
    <Button asChild className="hidden h-11 gap-2 rounded-xl px-5 text-sm font-bold shadow-sm shadow-primary/25 transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-primary/30 md:inline-flex">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Download className="!size-4" />
        دانلود اپلیکیشن
      </a>
    </Button>
  );
}
