CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"productName" varchar(255) NOT NULL,
	"shortDesc" varchar(255) NOT NULL,
	"desc" varchar(700) NOT NULL,
	"isFeatured" boolean DEFAULT false,
	"categoryId" uuid,
	"description" varchar NOT NULL,
	"imageName" varchar NOT NULL,
	"proce" numeric DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_id_unique" UNIQUE("id"),
	CONSTRAINT "products_productName_unique" UNIQUE("productName")
);
