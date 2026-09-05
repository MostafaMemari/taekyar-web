import { Dumbbell, Users } from "lucide-react";

import { BELT_COLORS } from "@/data/home/hero";
import { StatCard } from "./stat-card";
import { AppScreen } from "./app-screen";

export function PhoneMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-fit">
      <span className="absolute -end-14 top-1/2 hidden -translate-y-1/2 select-none font-black text-3xl tracking-[0.4em] text-foreground/[0.05] [writing-mode:vertical-rl] xl:block">
        태권도
      </span>

      <div className="relative w-[218px] rounded-[2.6rem] bg-[#16161a] p-[10px] shadow-2xl shadow-black/25 ring-1 ring-black/30 sm:w-[248px] lg:w-[264px]">
        <AppScreen belts={BELT_COLORS} />
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
