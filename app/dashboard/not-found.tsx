import { NotFoundContent } from "@/components/shared/not-found-content";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "صفحه پیدا نشد",
};

export default function NotFound() {
  return (
    <Card className="gap-0 rounded-xl p-0 shadow-none">
      <NotFoundContent hint="ممکن است نشانی اشتباه باشد یا مقاله موردنظر حذف شده باشد." />
    </Card>
  );
}
