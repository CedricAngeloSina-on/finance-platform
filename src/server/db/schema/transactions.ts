import { z } from "zod";
import { relations } from "drizzle-orm";
import { integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { createTable } from "~/server/db/create-table";

import { accounts } from "~/server/db/schema/accounts";
import { categories } from "~/server/db/schema/categories";

export const transactions = createTable("transaction", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  amount: integer().notNull(),
  payee: text().notNull(),
  notes: text(),
  date: timestamp({ mode: "date" }).notNull(),

  account_id: text()
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  category_id: text().references(() => categories.id, { onDelete: "set null" }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.account_id],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.category_id],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
export const updateTransactionSchema = createUpdateSchema(transactions, {
  date: z.coerce.date(),
});
