CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryName" varchar(255) NOT NULL,
	"description" varchar NOT NULL,
	"imageName" varchar NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_id_unique" UNIQUE("id")
);
