import { CONTACT_PAGE_INTRO } from "@/data/contact";
import { PageHeader } from "@/components/shared/page-header";

export function ContactHeader() {
  return <PageHeader {...CONTACT_PAGE_INTRO} />;
}
