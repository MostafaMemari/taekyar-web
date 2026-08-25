import { Dumbbell, Users } from "lucide-react";

import { BELT_LADDER, TODAY_TRAININGS } from "./data";
import { StatCard } from "./stat-card";
import { AppScreen } from "./app-screen";

export function PhoneMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-fit">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_38%,rgba(224,40,46,0.14),rgba(224,40,46,0)_65%)] sm:-inset-16" />

      <span className="absolute -end-14 top-1/2 hidden -translate-y-1/2 select-none font-black text-3xl tracking-[0.4em] text-foreground/[0.05] [writing-mode:vertical-rl] xl:block">
        태권도
      </span>

      <div className="relative w-[264px] rounded-[2.6rem] bg-[#16161a] p-[10px] shadow-2xl shadow-black/25 ring-1 ring-black/30 sm:w-[290px]">
        <AppScreen belts={BELT_LADDER} trainings={TODAY_TRAININGS} />
      </div>

      <StatCard
        icon={Dumbbell}
        value="۵۰+"
        label="فن آموزشی"
        className="absolute -top-6 end-2 animate-hero-float sm:-end-10"
      />
      <StatCard
        icon={Users}
        value="۱۰۰۰+"
        label="تمرین‌کننده فعال"
        className="absolute -bottom-8 -start-2 hidden animate-hero-float [animation-delay:-3s] sm:block sm:-start-12"
      />
    </div>
  );
}
