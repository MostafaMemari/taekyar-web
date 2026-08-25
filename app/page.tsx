import { BeltDivider } from "@/components/belt-divider";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { BlogPreview } from "@/components/home/blog-preview";
import { CtaSection } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <BeltDivider variant="slant" className="h-3 opacity-90" />
      <BlogPreview />
      <CtaSection />
    </>
  );
}
