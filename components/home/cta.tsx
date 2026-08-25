import { Download } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#e0282e_0%,#b01d22_55%,#701014_100%)] px-6 py-16 text-center sm:px-12 lg:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0_3px,transparent_3px_56px)]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-black leading-snug text-white sm:text-4xl">
                آماده‌ای اولین ضربه بزنی؟
              </h2>
              <p className="mt-5 leading-8 text-white/85">
                همین حالا تک‌یار را نصب کن؛ اولین قدم تا کمربند سیاه را امروز
                بردار، نه از شنبه آینده.
              </p>
              <Button
                type="button"
                size="lg"
                className="mt-9 h-12 gap-2.5 rounded-lg bg-white px-7 text-base font-bold text-primary shadow-xl shadow-black/25 hover:bg-white/90"
              >
                <Download />
                دانلود رایگان تک‌یار
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
