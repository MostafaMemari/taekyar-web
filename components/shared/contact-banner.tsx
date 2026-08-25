"use client";

import Link from "next/link";
import { ArrowLeft, MessagesSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ContactBannerProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function ContactBanner({
  title,
  description,
  actionLabel,
  actionHref,
}: ContactBannerProps) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-2xl bg-belt-black p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
        <MessagesSquare className="!size-6" />
      </span>

      <div className="flex-1">
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-7 text-white/60">{description}</p>
      </div>

      <Button
        asChild
        size="lg"
        className="h-11 w-full shrink-0 gap-2 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 sm:w-auto"
      >
        <Link href={actionHref}>
          {actionLabel}
          <ArrowLeft className="!size-4" />
        </Link>
      </Button>
    </div>
  );
}
