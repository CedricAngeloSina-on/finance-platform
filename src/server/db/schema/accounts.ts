import { text } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { createTable } from "~/server/db/create-table";

export const accounts = createTable("account", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  plaid_id: text(),
  user_id: text().notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);
export const updateAccountSchema = createUpdateSchema(accounts);
