ALTER TABLE "products" ADD COLUMN "price" numeric DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "proce";