"use client";

import { format } from "date-fns";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(221.2 83.2% 53.3%)",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(340 75% 55%)",
  },
} satisfies ChartConfig;

type BarChartProps = {
  data?: { date: Date; income: number; expenses: number }[] | undefined;
};

export function BarChart({ data = [] }: BarChartProps) {
  return (
    <Card className="rounded-xl p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl font-semibold">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <ChartContainer config={chartConfig}>
          <RechartsBarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: Date) => format(value, "MMM dd")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
