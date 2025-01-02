CREATE TABLE "finance-platform_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"payee" text NOT NULL,
	"notes" text,
	"date" timestamp NOT NULL,
	"account_id" text NOT NULL,
	"category_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance-platform_transaction" ADD CONSTRAINT "finance-platform_transaction_account_id_finance-platform_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."finance-platform_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance-platform_transaction" ADD CONSTRAINT "finance-platform_transaction_category_id_finance-platform_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."finance-platform_category"("id") ON DELETE set null ON UPDATE no action;