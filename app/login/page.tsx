import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

import { LoginForm } from "@/components/dashboard/auth/login-form";
import { BeltDivider } from "@/components/shared/belt-divider";
import { LOGIN_LABELS } from "@/data/dashboard/ui";

export const metadata: Metadata = {
  title: "ورود به پیشخوان",
};

export default function LoginPage() {
  return (
    <div className="theme-light relative flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:p-6">
      <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0 opacity-[0.035]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[4px]">
        <span className="flex-1 bg-belt-white" />
        <span className="flex-1 bg-belt-yellow" />
        <span className="flex-1 bg-belt-green" />
        <span className="flex-1 bg-belt-blue" />
        <span className="flex-1 bg-belt-red" />
        <span className="flex-1 bg-belt-black" />
      </div>

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[20px] border border-border/60 bg-card shadow-2xl shadow-black/10 sm:rounded-[24px]">
        <div className="grid lg:grid-cols-[1.05fr_1.45fr]">
          <div className="dark relative hidden flex-col justify-between overflow-hidden bg-belt-black p-8 text-card-foreground lg:flex">
            <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0 opacity-[0.06]" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-sans text-[18px] font-black text-primary-foreground shadow-md shadow-primary/30">
                  ت
                </span>
                <div className="leading-none">
                  <p className="font-sans text-[18px] font-black tracking-tight text-card-foreground">تک‌یار</p>
                  <p lang="ko" className="mt-1 font-sans text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                    태권도
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-sans text-[11px] font-bold tracking-widest text-muted-foreground">
                  <Shield className="size-3.5" aria-hidden="true" />
                  پیشخوان مدیریت
                </p>
                <h2 className="mt-4 text-balance font-sans text-[22px] font-black leading-8 text-card-foreground">
                  همراه مطمئن
                  <br />
                  مدیریت محتوا
                </h2>
                <p className="mt-3 max-w-xs font-sans text-[13px] leading-6 text-muted-foreground">
                  انتشار مقاله، مدیریت دسته‌بندی و بررسی دیدگاه‌ها — همه در یک پیشخوان یکپارچه با هویت تک‌یار.
                </p>
              </div>
            </div>

            <div className="relative space-y-4">
              <BeltDivider variant="pill" width="full" className="h-1 w-20 opacity-80" />
              <p className="font-sans text-[11px] leading-5 text-muted-foreground">
                هر کمربند با هزار تمرین ساده شروع می‌شود — این پیشخوان همان هزار تمرین را منظم می‌کند.
              </p>
            </div>
          </div>

          <div className="relative bg-card p-6 sm:p-8 lg:p-8">
            <div className="absolute inset-x-0 top-0 hidden h-[3px] lg:block">
              <BeltDivider width="full" className="h-full border-0 opacity-90" />
            </div>

            <div className="lg:hidden">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-sans text-base font-black text-primary-foreground shadow-sm">
                  ت
                </span>
                <span className="font-sans text-[16px] font-black text-card-foreground">تک‌یار</span>
              </div>
            </div>

            <div className="mt-6 lg:mt-2">
              <h1 className="font-sans text-[20px] font-black tracking-tight text-card-foreground sm:text-[22px]">{LOGIN_LABELS.title}</h1>
              <p className="mt-2 font-sans text-[13px] leading-6 text-muted-foreground">{LOGIN_LABELS.description}</p>
            </div>

            <LoginForm />

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-border/60 pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                بازگشت به سایت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
