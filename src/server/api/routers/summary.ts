import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";

import { accounts } from "~/server/db/schema/accounts";
import { categories } from "~/server/db/schema/categories";
import { transactions } from "~/server/db/schema/transactions";
import { calculatePercentageChange, fillMissingDays } from "~/lib/utils";

export const summaryRouter = createTRPCRouter({
  getSummary: protectedProcedure
    .input(z.object({ from: z.string().optional(), to: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      // calculates the default date range from today to the last 30 days
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = input.from
        ? parse(input.from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = input.to
        ? parse(input.to, "yyyy-MM-dd", new Date())
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
        return await ctx.db
          .select({
            income:
              sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                Number,
              ),
            expenses:
              sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                Number,
              ),
            remaining: sum(transactions.amount).mapWith(Number),
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.account_id, accounts.id))
          .where(
            and(
              eq(accounts.user_id, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate),
            ),
          )
          .groupBy(transactions.date)
          .orderBy(desc(transactions.date));
      }

      const [currentPeriod] = await fetchFinancialData(
        ctx.userId,
        startDate,
        endDate,
      );

      const [lastPeriod] = await fetchFinancialData(
        ctx.userId,
        lastPeriodStart,
        lastPeriodEnd,
      );

      const incomeChange = calculatePercentageChange(
        currentPeriod?.income ?? 0,
        lastPeriod?.income ?? 0,
      );

      const expensesChange = calculatePercentageChange(
        currentPeriod?.income ?? 0,
        lastPeriod?.income ?? 0,
      );

      const remainingChange = calculatePercentageChange(
        currentPeriod?.income ?? 0,
        lastPeriod?.income ?? 0,
      );

      const categorySummary = await ctx.db
        .select({
          name: categories.name,
          value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_id, accounts.id))
        .innerJoin(categories, eq(transactions.category_id, categories.id))
        .where(
          and(
            eq(accounts.user_id, ctx.userId),
            lt(transactions.amount, 0),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .groupBy(categories.name)
        .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

      const topCategorySummary = categorySummary.slice(0, 3);
      const otherCategorySummary = categorySummary.slice(3);
      const otherCategorySum = otherCategorySummary.reduce(
        (sum, current) => sum + current.value,
        0,
      );

      const finalCategorySummary = topCategorySummary;
      if (otherCategorySummary.length > 0) {
        finalCategorySummary.push({ name: "Other", value: otherCategorySum });
      }

      const activeDays = await ctx.db
        .select({
          date: transactions.date,
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number,
            ),
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number,
            ),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_id, accounts.id))
        .where(
          and(
            eq(accounts.user_id, ctx.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date);

      const days = fillMissingDays(activeDays, startDate, endDate);

      return {
        remainingAmmount: currentPeriod!.income,
        remainingChange,
        incomeAmmount: currentPeriod!.income,
        incomeChange,
        expensesAmount: currentPeriod!.expenses,
        expensesChange,
        categorySummary: finalCategorySummary,
        days,
      };
    }),
});
