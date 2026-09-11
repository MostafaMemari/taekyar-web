import { FAQ_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { HomepageFaqManager } from "@/components/dashboard/faqs/homepage-faq-manager";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: FAQ_LABELS.title,
};

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({
    where: { location: "HOMEPAGE" },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: { id: true, question: true, answer: true, order: true, isActive: true },
  });

  return (
    <div className="space-y-5">
      <DashboardPageHeader title={FAQ_LABELS.title} description={FAQ_LABELS.description} />

      <HomepageFaqManager initialFaqs={faqs} />
    </div>
  );
}
