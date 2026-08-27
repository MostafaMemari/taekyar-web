import type { Metadata } from "next";

import { ChannelCard } from "@/components/contact/channel-card";
import { CONTACT_CHANNELS } from "@/data/contact";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHeader } from "@/components/contact/contact-header";
import { SupportInfo } from "@/components/contact/support-info";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "راه‌های ارتباط با تیم تک‌یار؛ فرم پیام مستقیم، ایمیل، تلفن پشتیبانی و شبکه‌های اجتماعی برای سوال، پیشنهاد یا گزارش اشکال.",
};

export default function ContactPage() {
  return (
    <>
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
        <Reveal>
          <ContactHeader />
        </Reveal>
      </Section>

      <Section containerClassName="pb-14 pt-6 sm:pb-16 sm:pt-8 lg:pt-10">
        <Reveal delay={80}>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-5">
            {CONTACT_CHANNELS.map((channel) => (
              <li key={channel.id}>
                <ChannelCard {...channel} />
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 grid items-start gap-4 sm:mt-10 lg:grid-cols-5 lg:gap-5">
          <Reveal delay={120} className="lg:col-span-3">
            <ContactForm />
          </Reveal>

          <Reveal delay={160} className="lg:col-span-2">
            <SupportInfo />
          </Reveal>
        </div>
      </Section>
    </>
  );
}