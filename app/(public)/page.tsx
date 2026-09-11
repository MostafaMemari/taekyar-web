import { Hero } from "@/components/home/hero/hero";
import { TrustBar } from "@/components/home/trust/trust-bar";
import { Features } from "@/components/home/features/features";
import { BeltJourney } from "@/components/home/belt-journey/belt-journey";
import { BlogPreview } from "@/components/home/blog-preview/blog-preview";
import { Faq } from "@/components/home/faq/faq";
import { CtaSection } from "@/components/home/cta/cta";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero appDownloadUrl={settings.appDownloadUrl} />
      <TrustBar />
      <Features />
      <BeltJourney />
      <BlogPreview />
      <Faq />
      <CtaSection appDownloadUrl={settings.appDownloadUrl} />
    </>
  );
}
