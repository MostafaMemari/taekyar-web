import Link from "next/link";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";

interface NotFoundContentProps {
  hint?: string;
}

export function NotFoundContent({ hint = "ممکن است نشانی تغییر کرده یا صفحه حذف شده باشد." }: NotFoundContentProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
      <p
        aria-hidden="true"
        className="bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-[5.5rem] font-black leading-none tracking-tight text-transparent select-none sm:text-[7rem]"
      >
        ۴۰۴
      </p>
      <BeltDivider variant="pill" width="contained" className="mt-4 h-1 w-16 sm:w-20" />
      <h1 className="mt-5 text-balance text-xl font-black leading-[1.6] tracking-tight sm:text-2xl">
        صفحه‌ای که دنبالش بودید پیدا نشد
      </h1>
      <p className="mt-2.5 max-w-sm text-pretty text-sm leading-7 text-muted-foreground">{hint}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="h-11 gap-2 rounded-xl px-6 text-[13px] font-bold shadow-lg shadow-primary/20">
          <Link href="/">صفحه اصلی</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 gap-2 rounded-xl border-border bg-card px-6 text-[13px] font-bold text-foreground hover:bg-muted"
        >
          <Link href="/blog">مشاهده مقالات</Link>
        </Button>
      </div>
    </div>
  );
}
