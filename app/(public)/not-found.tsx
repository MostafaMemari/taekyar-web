import { NotFoundContent } from "@/components/shared/not-found-content";
import { Section } from "@/components/shared/section";

export const metadata = {
  title: "صفحه پیدا نشد",
};

export default function NotFound() {
  return (
    <Section pattern="none" containerClassName="pb-10 sm:pb-14">
      <NotFoundContent />
    </Section>
  );
}
