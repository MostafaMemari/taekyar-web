import { Hero } from "@/components/home/hero/hero";
import { Steps } from "@/components/home/steps/steps";
import { Belts } from "@/components/home/belts/belts";
import { SectionCategories } from "@/components/home/categories/section-categories";
import { TechniquesEncyclopedia } from "@/components/home/techniques/techniques-encyclopedia";
import { AppCard } from "@/components/home/app-card/app-card";
import { TechniqueShuffle } from "@/components/home/techniques/technique-shuffle";
import { BlogPreview } from "@/components/home/blog-preview/blog-preview";
import { Values } from "@/components/home/values/values";
import { Roadmap } from "@/components/home/roadmap/roadmap";
import { Checklist } from "@/components/home/checklist/checklist";
import { Faq } from "@/components/home/faq/faq";
import { CtaSection } from "@/components/home/cta/cta";
import { getCategoryTree } from "@/lib/blog";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const settings = await getSiteSettings();
  const categories = await getCategoryTree();
  const techniqueCategoryPath = categories.find((c) => c.name === "تکنیک‌ها")?.path ?? null;

  return (
    <>
      <Hero
        appDownloadUrl={settings.appDownloadUrl}
        postsCount={categories.reduce((sum, category) => sum + category.postCount, 0)}
        categoriesCount={categories.length}
      />
      <Steps />
      <Belts />
      <SectionCategories categories={categories} />
      <TechniquesEncyclopedia techniqueCategoryPath={techniqueCategoryPath} />
      <AppCard appDownloadUrl={settings.appDownloadUrl} />
      <TechniqueShuffle techniqueCategoryPath={techniqueCategoryPath} />
      <BlogPreview />
      <Values />
      <Roadmap />
      <Checklist />
      <Faq />
      <CtaSection appDownloadUrl={settings.appDownloadUrl} />
    </>
  );
}
