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
      <BlogPreview />
      <Faq />
      <CtaSection />
    </>
  );
}
