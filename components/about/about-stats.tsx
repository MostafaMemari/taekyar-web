import { Card, CardContent } from "@/components/ui/card";
import { ABOUT_STATS } from "@/data/about";

export function AboutStats() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
      {ABOUT_STATS.map((stat) => (
        <li key={stat.label} className="h-full">
          <Card className="h-full p-0">
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center sm:py-6">
              <span className="text-xl font-black tabular-nums text-primary sm:text-2xl">{stat.value}</span>
              <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">{stat.label}</span>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
