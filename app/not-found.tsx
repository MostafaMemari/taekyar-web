import type { Metadata } from "next";

import { NotFoundContent } from "@/components/shared/not-found-content";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section pattern="none">
      <NotFoundContent />
    </Section>
  );
}
