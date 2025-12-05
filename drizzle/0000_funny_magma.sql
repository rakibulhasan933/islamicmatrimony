CREATE TYPE "public"."biodata_type" AS ENUM('bride', 'groom');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."marital_status" AS ENUM('unmarried', 'divorced', 'widow', 'widower');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('active', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."membership_type" AS ENUM('free', 'silver', 'gold');--> statement-breakpoint
CREATE TABLE "biodatas" (
	"id" serial PRIMARY KEY NOT NULL,
	"biodata_no" varchar(20) NOT NULL,
	"user_id" integer NOT NULL,
	"type" "biodata_type" NOT NULL,
	"photo" text,
	"full_name" varchar(255) NOT NULL,
	"gender" "gender" NOT NULL,
	"date_of_birth" timestamp,
	"age" integer,
	"height" varchar(20),
	"weight" varchar(20),
	"blood_group" varchar(10),
	"complexion" varchar(50),
	"marital_status" "marital_status" NOT NULL,
	"permanent_district" varchar(100),
	"permanent_address" text,
	"current_district" varchar(100),
	"current_address" text,
	"education" varchar(255),
	"education_details" text,
	"occupation" varchar(255),
	"occupation_details" text,
	"monthly_income" varchar(50),
	"father_name" varchar(255),
	"father_occupation" varchar(255),
	"mother_name" varchar(255),
	"mother_occupation" varchar(255),
	"siblings" text,
	"religious_practice" varchar(100),
	"prayer_habit" varchar(100),
	"wears_hijab" boolean,
	"has_beard" boolean,
	"expected_age" varchar(50),
	"expected_height" varchar(50),
	"expected_education" varchar(255),
	"expected_district" varchar(100),
	"expected_marital_status" varchar(100),
	"partner_qualities" text,
	"guardian_phone" varchar(20),
	"guardian_relation" varchar(50),
	"is_approved" boolean DEFAULT true,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "biodatas_biodata_no_unique" UNIQUE("biodata_no")
);
--> statement-breakpoint
CREATE TABLE "contact_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"viewer_user_id" integer NOT NULL,
	"biodata_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" "membership_type" DEFAULT 'free' NOT NULL,
	"status" "membership_status" DEFAULT 'active' NOT NULL,
	"contact_views_remaining" integer DEFAULT 0,
	"contact_views_total" integer DEFAULT 0,
	"starts_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"biodata_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"profile_image" text,
	"email_verified" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "biodatas" ADD CONSTRAINT "biodatas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_views" ADD CONSTRAINT "contact_views_viewer_user_id_users_id_fk" FOREIGN KEY ("viewer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_views" ADD CONSTRAINT "contact_views_biodata_id_biodatas_id_fk" FOREIGN KEY ("biodata_id") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlists" ADD CONSTRAINT "shortlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlists" ADD CONSTRAINT "shortlists_biodata_id_biodatas_id_fk" FOREIGN KEY ("biodata_id") REFERENCES "public"."biodatas"("id") ON DELETE cascade ON UPDATE no action;