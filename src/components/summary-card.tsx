import { type LucideIcon } from "lucide-react";

import { cn, formatPercentage } from "~/lib/utils";
import { Card, CardContent, CardTitle } from "~/components/ui/card";

type DataCardProps = {
  title: string;
  icon: LucideIcon;
  value?: number;
  dateRange: string;
  percentageChange?: number;
};

export function SummaryCard({
  title,
  icon: Icon,
  value,
  dateRange,
  percentageChange,
}: DataCardProps) {
  return (
    <Card className="aspect-auto rounded-xl p-4">
      <div className="flex justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <p className="text-md text-muted-foreground">{dateRange}</p>
        </div>
        <div className="flex aspect-square items-center justify-center rounded-md border-2 border-muted-foreground/50 bg-primary-foreground p-2">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      <CardContent className="p-0">
        <p className="text-4xl font-bold">{value ?? "-"}</p>
        {percentageChange !== undefined && (
          <p
            className={cn(
              "line-clamp-1 text-sm text-muted-foreground",
              percentageChange > 0 && "text-emerald-500",
              percentageChange < 0 && "text-rose-500",
            )}
          >
            {formatPercentage(percentageChange, { addPrefix: true })} from last
            period
          </p>
        )}
      </CardContent>
    </Card>
  );
}
