import { text } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { createTable } from "~/server/db/create-table";

export const categories = createTable("category", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  plaid_id: text(),
  user_id: text().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);
export const updateCategorySchema = createUpdateSchema(categories);
