import Link from "next/link";
import { ArrowLeft, MessagesSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ContactBanner() {
  return (
    <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl bg-card p-6 text-center shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.05] sm:flex-row sm:gap-6 sm:p-7 sm:text-start">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
        <MessagesSquare className="!size-6" />
      </span>
      <div className="flex-1">
        <h3 className="text-lg font-extrabold">سوال دیگری دارید؟ با ما تماس بگیرید</h3>
        <p className="mt-1 text-sm font-normal leading-7 text-muted-foreground">
          تیم پشتیبانی تک‌یار در سریع‌ترین زمان ممکن پاسخگوی شماست.
        </p>
      </div>
      <Button
        asChild
        size="lg"
        className="h-11 shrink-0 gap-2 rounded-xl bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
      >
        <Link href="/contact">
          تماس با ما
          <ArrowLeft className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
