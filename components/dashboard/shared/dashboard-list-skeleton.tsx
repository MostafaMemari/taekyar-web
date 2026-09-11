import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardListSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      <Card className="gap-0 rounded-xl p-0 shadow-none">
        <div className="border-b border-border px-3 py-3 sm:px-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function DashboardFormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-80" />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="gap-0 rounded-xl p-0 shadow-none">
            <div className="space-y-3 p-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </Card>
          <Card className="gap-0 rounded-xl p-0 shadow-none">
            <div className="p-4">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="gap-0 rounded-xl p-0 shadow-none">
            <div className="space-y-3 p-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
