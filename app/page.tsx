import { BeltDivider } from "@/components/shared/belt-divider";
import { Hero } from "@/components/home/hero/hero";
import { Features } from "@/components/home/features/features";
import { BlogPreview } from "@/components/home/blog-preview/blog-preview";
import { Faq } from "@/components/home/faq/faq";
import { CtaSection } from "@/components/home/cta/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <BeltDivider variant="slant" className="h-3 opacity-90" />
      <BlogPreview />
      <Faq />
      <CtaSection />
    </>
  );
}
