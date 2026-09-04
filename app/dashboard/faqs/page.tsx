import { FAQ_LABELS } from "@/data/dashboard/ui";
import { prisma } from "@/lib/prisma";
import { HomepageFaqManager } from "@/components/dashboard/faqs/homepage-faq-manager";

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
      <div>
        <h1 className="text-xl font-black text-foreground sm:text-2xl">{FAQ_LABELS.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{FAQ_LABELS.description}</p>
      </div>

      <HomepageFaqManager initialFaqs={faqs} />
    </div>
  );
}
