import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import {
  categories,
  insertCategorySchema,
  updateCategorySchema,
} from "~/server/db/schema/categories";

export const categoriesRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(insertCategorySchema.pick({ name: true }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          plaid_id: "TEST PLAID ID",
          user_id: ctx.userId,
        })
        .returning();

      return category[0];
    }),

  getCategory: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const category = await ctx.db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(
          and(eq(categories.user_id, ctx.userId), eq(categories.id, input.id)),
        );

      return category[0];
    }),

  getAllCategories: protectedProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.user_id, ctx.userId));

    return allCategories;
  }),

  updateCategory: protectedProcedure
    .input(updateCategorySchema.pick({ id: true, name: true }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        return null;
      }

      const category = await ctx.db
        .update(categories)
        .set({
          name: input.name,
        })
        .where(
          and(eq(categories.user_id, ctx.userId), eq(categories.id, input.id)),
        )
        .returning();

      return category[0];
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedCategoryId = await ctx.db
        .delete(categories)
        .where(
          and(eq(categories.user_id, ctx.userId), eq(categories.id, input.id)),
        )
        .returning({ id: categories.id });

      return deletedCategoryId[0];
    }),

  deleteCategories: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const deletedCategoryIds = await ctx.db
        .delete(categories)
        .where(
          and(
            eq(categories.user_id, ctx.userId),
            inArray(categories.id, input.ids),
          ),
        )
        .returning({ id: categories.id });

      return deletedCategoryIds;
    }),
});
