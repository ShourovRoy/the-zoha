CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(17) NOT NULL,
	"password" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"postCode" varchar(10) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
