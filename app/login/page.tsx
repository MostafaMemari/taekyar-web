import type { Metadata } from "next";

import { LoginForm } from "@/components/dashboard/auth/login-form";
import { Wordmark } from "@/components/layout/header/wordmark";
import { BeltDivider } from "@/components/shared/belt-divider";
import { LOGIN_LABELS } from "@/data/dashboard/ui";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ورود به پیشخوان",
};

export default function LoginPage() {
  return (
    <div className="theme-light flex min-h-full items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Wordmark />
        </div>

        <div className={cn(SURFACE_CARD, "relative overflow-hidden")}>
          <BeltDivider width="full"
            className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-90"
          />

          <div className="p-6 pt-8 sm:p-7 sm:pt-9">
            <h1 className="text-lg font-black">{LOGIN_LABELS.title}</h1>
            <p className="mt-1.5 text-[13px] leading-7 text-muted-foreground">
              {LOGIN_LABELS.description}
            </p>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
