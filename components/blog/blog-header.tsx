import { BLOG_INDEX_INTRO } from "@/data/blog/index-page";
import { PageHeader } from "@/components/shared/page-header";

export function BlogHeader() {
  return <PageHeader {...BLOG_INDEX_INTRO} />;
}
