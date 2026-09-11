import { ABOUT_INTRO } from "@/data/about";
import { PageHeader } from "@/components/shared/page-header";

export function AboutHeader() {
  return <PageHeader {...ABOUT_INTRO} />;
}
