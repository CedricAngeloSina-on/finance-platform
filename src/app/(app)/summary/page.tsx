"use client";

import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

import { formatDateRange } from "~/lib/utils";
import { SummaryCard } from "~/components/summary-card";
import { BarChart } from "~/components/charts/bar-chart";

function SummaryContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  const summary = api.summary.getSummary.useQuery({});
  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
        <SummaryCard
          title="Remaining"
          icon={PiggyBank}
          value={summary.data?.remainingAmmount}
          dateRange={dateRangeLabel}
          percentageChange={summary.data?.remainingChange}
        />
        <SummaryCard
          title="Income"
          icon={TrendingUp}
          value={summary.data?.incomeAmmount}
          dateRange={dateRangeLabel}
          percentageChange={summary.data?.incomeChange}
        />
        <SummaryCard
          title="Expenses"
          icon={TrendingDown}
          value={summary.data?.expensesAmount}
          dateRange={dateRangeLabel}
          percentageChange={summary.data?.expensesChange}
        />
      </div>
      <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
        <div className="min-h-[300px] flex-1 rounded-xl lg:col-span-2">
          <BarChart data={summary.data?.days} />
        </div>
        <div className="min-h-[300px] flex-1 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function Summary() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SummaryContent />
    </Suspense>
  );
}
