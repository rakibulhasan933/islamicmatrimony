ALTER TABLE "biodatas" DROP CONSTRAINT "biodatas_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "biodatas" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "biodatas" ADD CONSTRAINT "biodatas_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE cascade ON UPDATE no action;