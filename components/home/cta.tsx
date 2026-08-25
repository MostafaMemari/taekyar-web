import { Download } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-0 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <Reveal>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-[2rem] bg-primary/15 blur-xl"
            />
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#e0282e_0%,#b01d22_55%,#701014_100%)] px-6 pb-10 pt-12 text-center shadow-xl shadow-primary/25 sm:px-12 sm:pb-12 sm:pt-14">
              <BeltDivider
                fullWidth
                className="absolute inset-x-0 top-0 border-0 opacity-90"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0_3px,transparent_3px_56px)]"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-black leading-snug text-white sm:text-4xl">
                  آماده‌ای اولین ضربه بزنی؟
                </h2>
                <p className="mt-4 text-[15px] leading-8 text-white/85 sm:text-base">
                  همین حالا تک‌یار را نصب کن؛ اولین قدم تا کمربند سیاه را امروز
                  بردار، نه از شنبه آینده.
                </p>
                <div className="relative mx-auto mt-7 w-fit">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-2xl bg-white/25 blur-xl"
                  />
                  <Button
                    type="button"
                    size="lg"
                    className="relative h-12 gap-2.5 rounded-xl bg-white px-7 text-base font-bold text-primary shadow-xl shadow-black/25 hover:bg-white/90"
                  >
                    <Download />
                    دانلود رایگان تک‌یار
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
