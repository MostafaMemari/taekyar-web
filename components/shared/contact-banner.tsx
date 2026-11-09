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
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 rounded-2xl bg-belt-black p-6 lg:flex lg:items-center lg:gap-6 lg:p-7">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#E0A800]/15 text-[#a37800] ring-1 ring-[#E0A800]/25">
        <MessagesSquare className="!size-6" />
      </span>

      <div className="contents lg:block lg:min-w-0 lg:flex-1">
        <h3 className="text-lg font-extrabold text-white">{title}</h3>
        <p className="col-span-full mt-1.5 text-sm leading-7 text-white/75">{description}</p>
      </div>

      <span
        aria-hidden="true"
        className="hidden h-10 w-px shrink-0 bg-white/15 lg:block"
      />

      <Button
        asChild
        size="lg"
        className="col-span-full h-11 w-full shrink-0 gap-2 rounded-xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-6 text-[15px] font-extrabold text-[#2A1F00] shadow-lg shadow-[#9A6D00]/25 hover:from-[#EFAF0A] hover:via-[#D0A018] hover:to-[#A87800] lg:w-auto"
      >
        <Link href={actionHref}>
          {actionLabel}
          <ArrowLeft className="!size-4" />
        </Link>
      </Button>
    </div>
  );
}
