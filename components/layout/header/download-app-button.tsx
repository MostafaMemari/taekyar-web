"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadAppButton({ href }: { href: string }) {
  return (
    <Button asChild className="hidden h-10 gap-2 rounded-lg px-4 text-sm font-bold shadow-sm shadow-primary/25 md:inline-flex">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Download className="!size-4" />
        دانلود اپلیکیشن
      </a>
    </Button>
  );
}
