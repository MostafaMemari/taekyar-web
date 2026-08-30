import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="mt-2 h-3.5 w-3/4" />
              </li>
            ))}
          </ul>
          <Skeleton className="hidden h-64 rounded-xl lg:block" />
        </div>
      </Card>
    </div>
  );
}
