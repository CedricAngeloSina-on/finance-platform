import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { accounts } from "~/server/db/schema/accounts";
import { categories } from "~/server/db/schema/categories";
import {
  transactions,
  insertTransactionSchema,
  updateTransactionSchema,
} from "~/server/db/schema/transactions";

export const transactionsRouter = createTRPCRouter({
  createTransaction: protectedProcedure
    .input(insertTransactionSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db
        .insert(transactions)
        .values({
          amount: input.amount,
          payee: input.payee,
          notes: input.notes,
          date: input.date,
          account_id: input.account_id,
          category_id: input.category_id,
        })
        .returning();

      return transaction[0];
    }),

  getTransaction: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }
      const transaction = await ctx.db
        .select({
          id: transactions.id,
          date: transactions.date,
          account_id: transactions.account_id,
          category_id: transactions.category_id,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_id, accounts.id))
        .where(
          and(eq(transactions.id, input.id), eq(accounts.user_id, ctx.userId)),
        );

      return transaction[0];
    }),

  getAllTransactions: protectedProcedure
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

      const allTransactions = await ctx.db
        .select({
          id: transactions.id,
          date: transactions.date,
          account: accounts.name,
          account_id: transactions.account_id,
          category: categories.name,
          category_id: transactions.category_id,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.account_id, accounts.id))
        .leftJoin(categories, eq(transactions.category_id, categories.id))
        .where(
          and(
            eq(accounts.user_id, ctx.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .orderBy(desc(transactions.date));

      return allTransactions;
    }),

  updateTransaction: protectedProcedure
    .input(updateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const transactionToUpdate = ctx.db.$with("transaction_to_delete").as(
        ctx.db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.account_id, accounts.id))
          .where(
            and(
              eq(accounts.user_id, ctx.userId),
              eq(transactions.id, input.id),
            ),
          ),
      );

      const transaction = await ctx.db
        .with(transactionToUpdate)
        .update(transactions)
        .set({
          amount: input.amount,
          payee: input.payee,
          notes: input.notes,
          date: input.date,
          account_id: input.account_id,
          category_id: input.category_id,
        })
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionToUpdate})`,
          ),
        )
        .returning();

      return transaction[0];
    }),

  deleteTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const transactionToDelete = ctx.db.$with("transaction_to_delete").as(
        ctx.db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.account_id, accounts.id))
          .where(
            and(
              eq(accounts.user_id, ctx.userId),
              eq(transactions.id, input.id),
            ),
          ),
      );

      const deletedTransactionId = await ctx.db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionToDelete})`,
          ),
        )
        .returning({ id: transactions.id });

      return deletedTransactionId[0];
    }),

  deleteTransactions: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const transactionsToDelete = ctx.db.$with("transactions_to_delete").as(
        ctx.db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.account_id, accounts.id))
          .where(
            and(
              eq(accounts.user_id, ctx.userId),
              inArray(transactions.id, input.ids),
            ),
          ),
      );

      const deletedTransactionIds = await ctx.db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionsToDelete})`,
          ),
        )
        .returning({ id: transactions.id });

      return deletedTransactionIds;
    }),
});
