import { BeltDivider } from "@/components/belt-divider";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { BlogPreview } from "@/components/home/blog-preview";
import { CtaSection } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BeltDivider />
      <Features />
      <BeltDivider />
      <BlogPreview />
      <CtaSection />
    </>
  );
}
