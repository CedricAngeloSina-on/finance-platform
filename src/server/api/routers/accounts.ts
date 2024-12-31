import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import {
  accounts,
  insertAccountSchema,
  updateAccountSchema,
} from "~/server/db/schema/accounts";

export const accountsRouter = createTRPCRouter({
  createAccount: protectedProcedure
    .input(insertAccountSchema.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(accounts).values({
        name: input.name,
        plaid_id: "TEST PLAID ID",
        user_id: ctx.userId,
      });
    }),

  getAccount: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const account = await ctx.db
        .select({ id: accounts.id, name: accounts.name })
        .from(accounts)
        .where(
          and(eq(accounts.user_id, ctx.userId), eq(accounts.id, input.id)),
        );

      return account[0];
    }),

  getAllAccounts: protectedProcedure.query(async ({ ctx }) => {
    const allAccounts = await ctx.db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(eq(accounts.user_id, ctx.userId));

    return allAccounts;
  }),

  updateAccount: protectedProcedure
    .input(updateAccountSchema.pick({ id: true, name: true }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const account = await ctx.db
        .update(accounts)
        .set({
          name: input.name,
        })
        .where(and(eq(accounts.user_id, ctx.userId), eq(accounts.id, input.id)))
        .returning();

      return account[0];
    }),
});
