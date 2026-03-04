CREATE TABLE "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"productId" uuid,
	"quantity" integer,
	"totalPrice" numeric,
	"basePrice" numeric,
	"productImage" varchar(500),
	"category" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "carts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;