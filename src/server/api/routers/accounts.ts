import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { accounts, insertAccountSchema } from "~/server/db/schema/accounts";

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
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const account = await db
        .select({ id: accounts.id, name: accounts.name })
        .from(accounts)
        .where(
          and(eq(accounts.user_id, ctx.userId), eq(accounts.id, input.id)),
        );

      return account[0];
    }),

  getAllAccounts: protectedProcedure.query(async ({ ctx }) => {
    const allAccounts = await db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(eq(accounts.user_id, ctx.userId));

    return allAccounts;
  }),
});
