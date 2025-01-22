"use client";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

import { formatDateRange } from "~/lib/utils";
import { SummaryCard } from "~/components/summary-card";
import { BarChart } from "~/components/charts/bar-chart";

export default function Summary() {
  // const utils = api.useUtils();

  const summary = api.summary.getSummary.useQuery({});

  const params = useSearchParams();
  const from = params.get("from") ?? undefined;
  const to = params.get("to") ?? undefined;

  const dateRangeLabel = formatDateRange({ to, from });
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
        <SummaryCard
          title={"Remaining"}
          icon={PiggyBank}
          value={summary.data?.remainingAmmount}
          dateRange={dateRangeLabel}
          percentageChange={summary.data?.remainingChange}
        />
        <SummaryCard
          title={"Income"}
          icon={TrendingUp}
          value={summary.data?.incomeAmmount}
          dateRange={dateRangeLabel}
          percentageChange={summary.data?.incomeChange}
        />
        <SummaryCard
          title={"Expenses"}
          icon={TrendingDown}
          value={summary.data?.expensesAmount}
          dateRange={dateRangeLabel}
          percentageChange={summary.data?.expensesChange}
        />
      </div>
    </div>
  );
}
