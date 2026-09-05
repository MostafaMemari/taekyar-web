import { Hero } from "@/components/home/hero/hero";
import { Hero2 } from "@/components/home/hero2/hero2";
import { TrustBar } from "@/components/home/trust/trust-bar";
import { Features } from "@/components/home/features/features";
import { BeltJourney } from "@/components/home/belt-journey/belt-journey";
import { CoachSection } from "@/components/home/coach/coach-section";
import { BlogPreview } from "@/components/home/blog-preview/blog-preview";
import { Faq } from "@/components/home/faq/faq";
import { CtaSection } from "@/components/home/cta/cta";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero2 appDownloadUrl={settings.appDownloadUrl} />
      <TrustBar />
      <Features />
      <Hero appDownloadUrl={settings.appDownloadUrl} />
      <BeltJourney />
      <CoachSection />
      <BlogPreview />
      <Faq />
      <CtaSection appDownloadUrl={settings.appDownloadUrl} />
    </>
  );
}
