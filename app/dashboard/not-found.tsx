import { NotFoundContent } from "@/components/shared/not-found-content";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "صفحه پیدا نشد",
};

export default function NotFound() {
  return (
    <Card className="p-0">
      <NotFoundContent hint="ممکن است نشانی اشتباه باشد یا مقاله موردنظر حذف شده باشد." />
    </Card>
  );
}
