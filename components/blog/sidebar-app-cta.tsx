import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { POST_LABELS } from "@/components/blog/post-config";
import { Button } from "@/components/ui/button";

export function SidebarAppCta() {
  return (
    <section
      aria-label={POST_LABELS.appCtaTitle}
      className="relative overflow-hidden rounded-2xl bg-belt-black p-3.5 shadow-sm shadow-black/[0.08] sm:p-4"
    >
      <BeltDivider fullWidth className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-80" />

      <h2 className="mt-1.5 text-[14px] font-black leading-7 text-white sm:text-[15px]">
        {POST_LABELS.appCtaTitle}
      </h2>
      <p className="mt-1.5 text-[11px] leading-6 text-white/60 sm:text-xs">
        {POST_LABELS.appCtaDescription}
      </p>

      <Button
        asChild
        className="mt-3 h-9 w-full gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
      >
        <Link href="/">
          {POST_LABELS.appCtaActionLabel}
          <ArrowLeft className="!size-4" />
        </Link>
      </Button>
    </section>
  );
}
