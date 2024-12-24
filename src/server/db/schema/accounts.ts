import { text } from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/create-table";

export const accounts = createTable("account", {
  id: text().primaryKey(),
  name: text().notNull(),
  plaid_id: text(),
  user_id: text().notNull(),
});
